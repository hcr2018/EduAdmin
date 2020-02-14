
import Http from './ImgHttp'
const ImgAPI = {
    //   图片上传
    UploadImg: (urlParams, file, config) => Http("post", '/helper/uploadFile/' + urlParams, file, config),
}
export default ImgAPI

