
import {NextApiHandler} from 'next';
import {withSession} from '../../../lib/withSession';
import { IncomingForm } from 'formidable'
import COS from 'cos-nodejs-sdk-v5'

export const config = {
  api: {
    bodyParser: false,
  }
};
//@ts-ignore
const UploadImg: NextApiHandler = withSession(async (req, res) => {
  if (req.method === 'POST') {
    const user = req.session.get('currentUser');
    if(!user){
      res.statusCode = 401
      res.end()
    }
    var cos = new COS({
      SecretId: 'AKIDKSLzQJRiOr61iBz380e7Uea1GIxSqLo3',
      SecretKey: 'qWzSm63k8Z06vmLt865mDQLaYGhpgO4V',
    });
    await new Promise((resolve, reject) => {
      const form = new IncomingForm()
      form.encoding = 'utf-8';
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        console.log(files,'files');
        if (err) return reject(err)
        var filePath = '';
        if(files.tmpFile){
          //@ts-ignore
            filePath = files.tmpFile.path;
        } else {
            for(var key in files){
              //@ts-ignore
                if( files[key].path && filePath==='' ){
                  //@ts-ignore
                    filePath = files[key].path;
                    break;
                }
            }
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        var fileName = new Date().getTime() + fileExt;
        cos.sliceUploadFile({
          Bucket: 'sthl-1256208836',
          Region: 'ap-shanghai',
          Key: fileName,
          FilePath:filePath,
        },  (err, data)=> {
          if(data && data.statusCode &&data.statusCode === 200){
            res.json({statusCode:200,url:'https://' + data.Location});
          }
        });
      })
    })
  }
});
export default UploadImg;