<template>
  <div class="registerForm">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Register</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  label="Username"
                  name="username"
                  :error-messages="usernameErrors"
                  prepend-icon="mdi-account"
                  type="text"
                />
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="email"
                  :error-messages="emailErrors"
                  prepend-icon="mdi-mail"
                  type="email"
                />
                <v-text-field
                  id="password"
                  v-model="password"
                  label="Password"
                  name="password"
                  type="password"
                  :error-messages="passwordErrors"
                  prepend-icon="mdi-key"
                />
                <v-text-field
                  id="comfirm"
                  v-model="confirmation"
                  label="Repeat password"
                  name="comfirm"
                  type="password"
                  :error-messages="confirmationErrors"
                  prepend-icon="mdi-key"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn large color="normal" @click="goToLogin()">
                Return to Login
              </v-btn>
              <v-btn large color="primary" @click="performRegister()">Create account</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <InfoDialog v-model="showDialog" :dialogTitle="dialogTitle" :dialogText="dialogText" />
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import InfoDialog from "./InfoDialog.vue";

@Component({
  mixins: [validationMixin],
  validations: {
    username: { required, minLength: minLength(2) },
    password: { required, minLength: minLength(6) },
    email: { required, email },
    confirmation: { required, sameAsPassword: sameAs("password") },
  },
  components: { InfoDialog },
})
export default class RegisterForm extends Vue {
  username = "";
  email = "";
  password = "";
  confirmation = "";
  showDialog = false;
  dialogTitle = "";
  dialogText = "";
  success = false;

  get usernameErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.username.$dirty) return errors;
    !this.$v.username.minLength && errors.push("Username must be at least 2 characters long");
    !this.$v.username.required && errors.push("Username is required.");
    return errors;
  }

  get emailErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.password.$dirty) return errors;
    !this.$v.email.email && errors.push("Invalid email format");
    !this.$v.email.required && errors.push("Email is required.");
    return errors;
  }

  get passwordErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.password.$dirty) return errors;
    !this.$v.password.minLength && errors.push("Password must be at least 6 characters long");
    !this.$v.password.required && errors.push("Password is required.");
    return errors;
  }

  get confirmationErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.confirmation.$dirty) return errors;
    !this.$v.confirmation.sameAsPassword && errors.push("Invalid password confirmation");
    !this.$v.confirmation.required && errors.push("Password confirmation is required.");
    return errors;
  }

  goToLogin(): void {
    this.$router.push({ path: "/" });
  }

  async performRegister(): Promise<void> {
    this.$v.$touch();
    if (this.$v.$invalid) return; // Block invalid requests here
    this.$api
      .registerUser(this.username, this.password, this.email)
      .then((resp) => {
        this.dialogText = resp.data.message;
        this.dialogTitle = "Account created";
        this.showDialog = true;
        this.success = true;
      })
      .catch((err) => {
        if (err && err.response) {
          const resp = err.response;
          this.dialogText = resp.data.message;
          this.dialogTitle = "Something went wrong...";
          this.showDialog = true;
          this.success = false;
        } else {
          this.dialogText = "Unknown error, please check your Internet connection";
          this.dialogTitle = "Something went wrong...";
          this.showDialog = true;
          this.success = false;
        }
      });
  }
}
</script>
