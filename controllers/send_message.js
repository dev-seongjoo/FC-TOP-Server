const CryptoJS = require("crypto-js");
const request = require("request");

function send_message(phone, AuthenticationCode) {
  const user_phone_number = phone; //수신 전화번호 기입
  let resultCode = 404;
  const date = Date.now().toString();
  const uri = process.env.SERVICE_ID; //서비스 ID
  const accessKey = process.env.NCP_KEY; //Access Key
  const secretKey = process.env.NCP_SECRET_KEY; // Secret Key
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);
  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);
  request(
    {
      method: method,
      json: true,
      uri: url,
      headers: {
        "Contenc-type": "application/json; charset=utf-8",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      body: {
        type: "SMS",
        countryCode: "82",
        from: "01033186433", //"발신번호기입"
        content: `[FC TOP] 인증번호는 ${AuthenticationCode}입니다. 정확히 입력해 주세요.`, //문자내용 기입
        messages: [{ to: `${user_phone_number}` }],
      },
    },
    function (err, res, html) {
      if (err) console.log(err);
      else {
        resultCode = 200;
        console.log(html);
      }
    }
  );
  return resultCode;
}

module.exports = send_message;
