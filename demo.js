var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
host:'smtp.gmail.com',
port:587,
secure:false,
requireTLS:true,
auth:{
  user:'anshu.madan123@gmail.com',
  pass: "oocfhobcvblneooq"
}
})

function sendEMail(req){
  var aa = `hi ${req.email}`
  var a = `${req.name}`
  console.log("bb",aa) 
    var mailOptions={   
        from: `hi ${req.email}`,
        to:'anshu.madan123@gmail.com',
        // cc:`${req.email}`,
        subject:`Apply for Leave from ${req.name}`,
        text:`${req.name}, I have applied leaves from ${req.startdate} to ${req.enddate} ${req.email} please approved 
        ${req.status} done
Thanks
${req.name}`

      }
transporter.sendMail(mailOptions,function(error,info){
if(error)
{
  console.log(error);

}
else{
  console.log("email has been sent", info.response);
  console.log("check email",req.email)
}
})
} 

module.exports = {
    sendEMail
}               
