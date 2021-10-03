import { Request } from "@/utils/api";
import service from "@/utils/http";
import { AxiosInstance } from "axios";

declare module 'vue/types/vue' {
  interface Vue {
    $service: AxiosInstance,
    $request: any,
  }
}