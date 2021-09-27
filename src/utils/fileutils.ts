import service from "./http";

export default {
  async downloadPic(fileToken: string, fileType: string) {
    return service.get(`/api/api/file/download/${fileToken}`, { responseType: 'arraybuffer' })
      .then((data: any) => {
        return data = `data:${fileType};base64,` + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      })
  }
}