<template>
  <div id="collect-files">
    <router-view
      :detailData="detailData"
      :collectFilesType="collectFilesType"
      :faceData="faceData"
      @passDetailData="passDetailData"
      @passFaceData="passFaceData"
    ></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CollectFiles extends Vue {
  private detailData: any = null;
  private collectFilesType: any = null;
  private faceData: any = null;
  passDetailData(data: ArchItemData) {
    this.detailData = data;
    if (this.collectFilesType)
      this.$router.push({ name: 'collectFilesDetail' })
    else
      this.$service.get('/api/api/type/getCollectedFileType')
        .then(({data: res}: any) => {
          console.log('getCollectedFileType', res)
          if (res.success && res.code === 200) {
            this.collectFilesType = res.data.children
            this.$router.push({ name: 'collectFilesDetail' })
          }
        })
      /* this.collectFilesType = this.testData;
      this.$router.push({ name: 'collectFilesDetail' }) */
  }
  passFaceData(data: any) {
    this.faceData = data;
  }
  testData =  {
        "id": -1,
        "categoryCode": null,
        "typeName": "root",
        "categoryType": 1,
        "children": [
            {
                "id": 25,
                "categoryCode": "23",
                "typeName": "校史",
                "categoryType": 1,
                "children": [
                    {
                        "id": 29,
                        "categoryCode": "33",
                        "typeName": "计院史",
                        "categoryType": 1,
                        "children": [
                            {
                                "id": 32,
                                "categoryCode": "49",
                                "typeName": "计科",
                                "categoryType": 1,
                                "children": null
                            },
                            {
                                "id": 33,
                                "categoryCode": "41",
                                "typeName": "软工",
                                "categoryType": 1,
                                "children": null
                            },
                            {
                                "id": 34,
                                "categoryCode": "42",
                                "typeName": "网工",
                                "categoryType": 1,
                                "children": null
                            },
                            {
                                "id": 312312,
                                "categoryCode": "43135",
                                "typeName": "什么工",
                                "categoryType": 1,
                                "children": null
                            },
                            {
                                "id": 3123212,
                                "categoryCode": "4313512",
                                "typeName": "为什么工",
                                "categoryType": 1,
                                "children": null
                            }
                        ]
                    },
                    {
                        "id": 30,
                        "categoryCode": "34",
                        "typeName": "自院史",
                        "categoryType": 1,
                        "children": [
                          {
                              "id": 300,
                              "categoryCode": "41",
                              "typeName": "自然真美",
                              "categoryType": 1,
                              "children": null
                          },
                          {
                              "id": 301,
                              "categoryCode": "42",
                              "typeName": "自动化也是",
                              "categoryType": 1,
                              "children": null
                          }
                        ]
                    },
                    {
                        "id": 31,
                        "categoryCode": "35",
                        "typeName": "信院史",
                        "categoryType": 1,
                        "children": null
                    }
                ]
            },
            {
                "id": 35,
                "categoryCode": "36",
                "typeName": "秃头史",
                "categoryType": 1,
                "children": [
                    {
                        "id": 36,
                        "categoryCode": "37",
                        "typeName": "tu秃了",
                        "categoryType": 1,
                        "children": null
                    }
                ]
            }
        ]
  }
}
</script>

<style lang="scss">
  #collect-files {
    width: 100vw;
    min-height: 100vh;
    background-image: linear-gradient(180deg, #ECF2FE, #E9F1FE);
  }
</style>