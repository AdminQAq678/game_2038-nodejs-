var express=require('express');
var fs=require('fs')
var app=express();
app.use(express.static('./'))
var maxscore=0;
var maxscorename="";
var myrank=[];

app.get('/',(req,res)=>{
	res.sendFile(__dirname+"/2048mb.html");
})

app.get('/maxscore',(req,res)=>{//获取客户端当前分数
	var currentScoreName="匿名用户";
	var currentScore=req.query.data;
	var currentScoreName=req.query.name;
	console.log("里篮球data:",req.query.data);
	console.log("浏览器name",req.query.name);
		var isRankchanged=false;
		if(myrank.length){
			for(var i=0;i<myrank.length;i++){
				for (var key in myrank[i]){
					if(parseInt(myrank[i][key])<=parseInt(currentScore)){
						console.log("12323")
						myrank.splice(i,0,{[currentScoreName]:currentScore});//这里放入最高分的信息
						console.log("排行榜更新")
						isRankchanged=true;
						break;
					}
				}
				if(isRankchanged==true)
				break;
			}
          if(isRankchanged==false){
				myrank.push({[currentScoreName]:currentScore});
			}
			if(parseInt(currentScore)>maxscore){
				maxscore=currentScore;
				var thescore=fs.writeFileSync("score.txt",maxscore);
				if(thescore) console.log("写入最高分失败");
				else{
					console.log("最高分更新成功");
				}
			}
			console.log("此时的rank",myrank)

		}else{
			//排名列表为空时
			myrank.splice(0,0,{[currentScoreName]:currentScore});
			isRankchanged=true;

		}

		
			if(!fs.writeFileSync("rank.txt",JSON.stringify(myrank).toString()))
			 console.log("isRankchanged=true");
		

})
app.get('/getmaxscore',(req,res)=>{
	fs.readFile('score.txt',(err,data)=>{
		if(err) {
			console.log("读取文件失败")
			fs.open('score.txt',"w+",(err)=>{
				if(err){
					console.log("创建文件失败")
				}else{
					var the=fs.writeFileSync("score.txt","0");
					if(the) console.log("写入失败")
				else{
					console.log("写入成功");
				}
				}
			});
		}
		else{
			console.log("读取文件数据成功")
			maxscore=data.toString();
			res.send(""+maxscore);
			console.log("向浏览器发送最高分数据成功",maxscore);

		}
		
	})

})
app.get("/getRank",(req,res)=>{
	fs.readFile("rank.txt",(err,data)=>{
		if(err){
			fs.open("rank.txt","w+",(err)=>{
				if(err) console.log("创建排名数据文件失败");
				else{
					console.log("创建排名数据文件成功");
					
				}
			})
			console.log("rank.txt读取失败")
		}else{
			if(data.toString()){
				console.log("data",data.toString())
			 	myrank=JSON.parse(data);
				
				 res.send(data);
			}else{
				res.send("");
			}
		}
	})
})
app.listen(8080,()=>{
	console.log("服务器监听3000端口中")
})