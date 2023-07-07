
module.exports.success = async function(req,res,data) {
  
  if(req.method == 'GET'){
    var response_data = await EncryptedData(req, res, data);
  }

    res.status(200).send({
      success: true,
      data: (req.method == 'GET') ? data : data
    });
  };
  
  module.exports.error = function(error) {
    return {
      success: false,
      error: error
    };
  };
  
  module.exports.validationError = function(errors) {
    return {
      success: false,
      errors: errors
    };
  };

  const EncryptedData = (async(req, res, data)=>{
    if (req.headers.env) {
        if (req.headers.env == 'test') {
            return data;
        } else {
            return await encryptedDataResponse(data);
        }
    } else {
        return await encryptedDataResponse(data);
    }
  })

  const encryptedDataResponse = (async (data) => {
    const crypto = require("crypto");
    const cipher = crypto.createCipheriv(process.env.algorithm, process.env.SecuritykeyEnc, process.env.initVectorEnc);
    const message = JSON.stringify(data);
    let encryptedData = cipher.update(message, "utf-8", "base64");
    encryptedData += cipher.final("base64");
    const mac = crypto.createHmac('sha256', process.env.SecuritykeyEnc)
        .update(Buffer.from(Buffer.from(process.env.initVectorEnc).toString("base64") + encryptedData, "utf-8").toString())
        .digest('hex');
    var response = {
        'mac': mac,
        'value': encryptedData
    }
    return response;
});