// 获取文本中的全部图片

const getHtmlImg = (html: string) => {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var srcReg = /\ssrc=['"](.*?)['"]/;
    return html.match(imgReg)?.map((value) => {
        return (value.match(srcReg) as ['', ''])[1]
    });
}
export default getHtmlImg