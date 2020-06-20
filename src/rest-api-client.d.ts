import Vue from "vue";
import { RestApiClient } from "@/common/RestApiClient";

declare module "vue/types/vue" {
  interface Vue {
    $api: RestApiClient;
  }
}
