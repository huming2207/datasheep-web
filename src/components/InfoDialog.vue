<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="headline">
        {{ dialogTitle }}
      </v-card-title>

      <v-card-text>
        {{ dialogText }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="show = false">
          Okay
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class InfoDialog extends Vue {
  @Prop(String) dialogTitle = "";
  @Prop(String) dialogText = "";

  // Ref: https://stackoverflow.com/a/49119008
  get show(): boolean {
    return this.$attrs.value as any; // Workaround for wrong typings
  }

  set show(val: boolean) {
    this.$emit("input", val);
  }
}
</script>
