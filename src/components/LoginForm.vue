<template>
  <div class="loginForm">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  :error-messages="usernameErrors"
                  v-model="username"
                />
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  prepend-icon="mdi-key"
                  :error-messages="passwordErrors"
                  v-model="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn large color="success" @click="goToRegister()">Register</v-btn>
              <v-btn large color="primary" @click="performLogin()">Login</v-btn>
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
import { required } from "vuelidate/lib/validators";
import InfoDialog from "./InfoDialog.vue";

@Component({
  mixins: [validationMixin],
  validations: {
    username: { required },
    password: { required },
  },
  components: { InfoDialog },
})
export default class LoginForm extends Vue {
  username = "";
  password = "";
  dialogTitle = "";
  dialogText = "";
  showDialog = false;

  async performLogin(): Promise<void> {
    this.$v.$touch();
    if (this.$v.$invalid) return; // Block invalid requests here
    try {
      const resp = await this.$api.loginUser(this.username, this.password);
      if (!resp.data.data || !resp.data.data.token) {
        this.dialogText = resp.data.message;
        this.dialogTitle = "Something went wrong...";
        this.showDialog = true;
      } else {
        this.$router.push({ path: "/browser" });
      }
    } catch (err) {
      if (err && err.response) {
        const resp = err.response;
        this.dialogText = resp.data.message;
        this.dialogTitle = "Something went wrong...";
        this.showDialog = true;
      } else {
        this.dialogText = "Unknown error, please check your Internet connection";
        this.dialogTitle = "Something went wrong...";
        this.showDialog = true;
      }
    }
  }

  get usernameErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.username.$dirty) return errors;
    !this.$v.username.required && errors.push("User name is required.");
    return errors;
  }

  get passwordErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.password.$dirty) return errors;
    !this.$v.password.required && errors.push("Password is required.");
    return errors;
  }

  goToRegister(): void {
    this.$router.push({ path: "/register" });
  }
}
</script>
