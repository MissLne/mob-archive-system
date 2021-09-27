import { Request } from "@/utils/api";
import service from "@/utils/http";

declare module 'vue/types/vue' {
  interface Vue {
    $service: any,
    $request: any,
  }
}