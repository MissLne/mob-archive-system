import { Request } from "@/utils/api";
import service from "@/utils/http";

declare module 'vue/types/vue' {
  interface Vue {
    $service: any,
    $request: any,
  }
  interface ArchItemData {
    id:	number,
    userId:	number,
  
    fileId:	number,
    fileName:	string,
    fileToken: string,
    fileType:	string,
  
    thumbnailFileId: number,
    thumbnailFileName: string,
    thumbnailFileToken: string,
    thumbnailFileType: string,
  
    topic: string,
    categoryCodeId:	number,
    confidentialLevel: number,
    retentionPeriod: number,
    departmentId:	number,
    fondsIdentifierId: number,
  }
}