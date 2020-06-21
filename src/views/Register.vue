<template>
  <div class="login">
    <v-content>
      <RegisterForm />
    </v-content>
  </div>
</template>

<script>
// @ is an alias to /src
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "Register",
  components: {
    RegisterForm,
  },
};
</script>
