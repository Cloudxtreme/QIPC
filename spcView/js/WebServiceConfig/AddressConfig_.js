Namespace.register("Agi.WebServiceConfig");
/* 注册命名空间 */
Agi.WebServiceConfig.Type = ".NET"; // value:[.NET/JAVA] 大小写敏感

var WebServiceAddress = "${webservice}";
Agi.ImgServiceAddress = "${images}";
Agi.SocketAddressInfo = {
	"Ip" : "${socketIP}",
	"Port" : "${socketPort}",
	"sessionID" : ""
};
Agi.ViewServiceAddress = "${agivisView}";
Agi.AndroidSocketAddressInfo = {
	"Ip" : "${socketIP}",
	"Port" : "${socketPort_java}",
	"SessionID" : ""
};