
import Http from './ImgHttp'
const ImgAPI = {
    //   课程图片上传
    UploadImgCourse: (urlParams, file, config) => Http("post", '/helper/uploadFile/' + urlParams, file, config),
}
export default ImgAPI

