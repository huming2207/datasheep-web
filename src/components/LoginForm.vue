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
                  :error-messages="errors"
                  v-model="username"
                />
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  prepend-icon="mdi-key"
                  :error-messages="errors"
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
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline">
            {{ dialogTitle }}
          </v-card-title>

          <v-card-text>
            {{ dialogText }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeDialog()">
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class LoginForm extends Vue {
  username = "";
  password = "";
  dialog = false;
  dialogTitle = "";
  dialogText = "";

  async performLogin(): Promise<void> {
    try {
      const resp = await this.$api.loginUser(this.username, this.password);
      if (!resp.data.data || !resp.data.data.token) {
        this.dialogText = resp.data.message;
        this.dialogTitle = "Something went wrong...";
        this.dialog = true;
      } else {
        this.$router.push({ path: "/browser" });
      }
    } catch (err) {
      if (err && err.response) {
        const resp = err.response;
        this.dialogText = resp.data.message;
        this.dialogTitle = "Something went wrong...";
        this.dialog = true;
      } else {
        this.dialogText = "Unknown error, please check your Internet connection";
        this.dialogTitle = "Something went wrong...";
        this.dialog = true;
      }
    }
  }

  closeDialog(): void {
    this.dialog = false;
  }

  goToRegister(): void {
    this.$router.push({ path: "/register" });
  }
}
</script>
