function clsSigmaFunc(sigmaArray, sigmaRule, checkDataSries) 
{
    this.sigmaArray     = sigmaArray;               //所有数据
    this.sigmaRule      = sigmaRule;                //规则
    this.checkDataSries = checkDataSries;           //分组信息
	this.check			= clsSigmaFunc$check;       //调度方法
	this.sigmaRules1	= clsSigmaFunc$sigmaRules1; //规则1
	this.sigmaRules2	= clsSigmaFunc$sigmaRules2; //规则2
	this.sigmaRules3	= clsSigmaFunc$sigmaRules3; //规则3
	this.sigmaRules4	= clsSigmaFunc$sigmaRules4; //规则4
	this.sigmaRules5	= clsSigmaFunc$sigmaRules5; //规则5
	this.sigmaRules6	= clsSigmaFunc$sigmaRules6; //规则6
	this.sigmaRules7	= clsSigmaFunc$sigmaRules7; //规则7
	this.sigmaRules8	= clsSigmaFunc$sigmaRules8; //规则8
    this.sigmaRuleDetail = clsSigmaFunc$getDetail;//根据规则号获取具体规则参数
}

//判定规则调度
function clsSigmaFunc$check() 
{
    this.sigmaRules8();
    this.sigmaRules7();
    this.sigmaRules6();
    this.sigmaRules5();
    this.sigmaRules4();
    this.sigmaRules3();
    this.sigmaRules2();
    this.sigmaRules1();
    return this.sigmaArray;
}

//规则1
function clsSigmaFunc$sigmaRules1()
{
	//得到八项规则中的某项K值
	var K;
	//得到八项规则中的某项点的颜色
	var color;
	//循环条数的高低值
	var min;
	var max;
	var xBar;
	//计算的K的上下限
	var Kmin;
	var Kmax;
	var Isigma;
	var y;
	var ischecked;
	for(var i = 0;i<this.sigmaRule.length;i++){
		if(this.sigmaRule[i].NO==1)
		{
			K = this.sigmaRule[i].Kvalue;
			color = this.sigmaRule[i].color;
			ischecked = this.sigmaRule[i].ischecked;
		}
	}
	if(!ischecked)
	{
		return;
	}
    for(var i = 0;i<this.checkDataSries.length;i++){
        min = this.checkDataSries[i].min;
        max = this.checkDataSries[i].max;
        xBar = this.checkDataSries[i].xBar;
        Isigma = this.checkDataSries[i].Isigma;
		Kmin = xBar-K*Isigma;
		Kmax = xBar+K*Isigma;
		for(var j = min;j<max;j++)
		{
		    y = this.sigmaArray[j].y;
			if(y>Kmax||y<Kmin){
			    this.sigmaArray[j].marker.fillColor = color;
			    this.sigmaArray[j].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: color,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                        return "1";//当前是第几项规则
                    },
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                }
			}
		}
    }
	return this.sigmaArray;
}

//根据规则号获取具体规则参数
function  clsSigmaFunc$getDetail(ruleNo)
{
    for(var i = 0;i<this.sigmaRule.length;i++){
        if(this.sigmaRule[i].NO==ruleNo)
        {
           return this.sigmaRule[i];
        }
    }
    return null;
}

//规则2  连续K点落在中心线同一侧
function clsSigmaFunc$sigmaRules2()
{
    //获取规则
    var sigmaRule=this.sigmaRuleDetail(2);
    var ischecked = sigmaRule.ischecked;
    if(!ischecked)
    {
    	return;
    }
    if(sigmaRule!=null)
    {
        var K = sigmaRule.Kvalue;
        var colorval = sigmaRule.color;
        var min,max,xBar,y;
        var up = 0;
        var down = 0;
        for(var i = 0;i<this.checkDataSries.length;i++){
            min = this.checkDataSries[i].min;
            max = this.checkDataSries[i].max;
            xBar = this.checkDataSries[i].xBar;
            up=0;
            down=0;
    		for(var j = min;j<max;j++)
    		{
    			
    		    y = this.sigmaArray[j].y;
    		    if(y<xBar)
    		    {
    		    	up = up+1;
    		    	down = 0;
    		    }else if(y==xBar)
    		    {
    		    	up = 0;
    		    	down = 0;
    		    }else
    		    {
    		    	down = down+1;
    		    	up = 0;
    		    }
    		    if(up>=K)
    		    {
    		    	this.sigmaArray[j].marker.fillColor = colorval;
    		    	this.sigmaArray[j].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: colorval,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                        return "2";//当前是第几项规则
                    },
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                }
    		    }
    		    if(down>=K)
    		    {
    		    	this.sigmaArray[j].marker.fillColor = colorval;
    		    	this.sigmaArray[j].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: colorval,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                        return "2";//当前是第几项规则
                    },
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                }
    		    }
    		}
        }
    }
    return this.sigmaArray;
}

//规则3连续K点递增或递减----K=6  8>=K>=5
function clsSigmaFunc$sigmaRules3()
{
	//得到八项规则中的某项K值
	var K;
	//得到八项规则中的某项点的颜色
	var color;
	//循环条数的高低值
	var min;
	var max;
	var y,yNext;
	var ischecked;
	for(var i = 0;i<this.sigmaRule.length;i++){
		if(this.sigmaRule[i].NO==3)
		{
			K = this.sigmaRule[i].Kvalue;
			color = this.sigmaRule[i].color;
			ischecked = this.sigmaRule[i].ischecked;
		}
	}
	if(!ischecked)
	{
		return;
	}
	//上升、下降的步长
	var up = 0;
	var down = 0;
    for(var i = 0;i<this.checkDataSries.length;i++){
    	up = 0;
    	down = 0;
        min = this.checkDataSries[i].min;
        max = this.checkDataSries[i].max;
		for(var j = min;j<max;j++)
		{
		    y = this.sigmaArray[j].y;
		    if(j+1!=max)
		    {
		    	yNext = this.sigmaArray[j+1].y;
		    }else{ break; }
		    if(y<yNext)
		    {
		    	up = up+1;
		    	down = 0;
		    }else if(y==yNext)
		    {
		    	up = 0;
		    	down = 0;
		    }else
		    {
		    	down = down+1;
		    	up = 0;
		    }
		    if(up>=K)
		    {
		    	this.sigmaArray[j+1].marker.fillColor = color;
		    	this.sigmaArray[j+1].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: color,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                        return "3";//当前是第几项规则
                    },
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                }
		    }
		    if(down>=K)
		    {
		    	this.sigmaArray[j+1].marker.fillColor = color;
		    	this.sigmaArray[j+1].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: color,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                        return "3";//当前是第几项规则
                    },
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                }
		    }
		}
    }	
    return this.sigmaArray;
}

//规则4连续K点中相邻点交替上下----K=14  14>=K>=12
function clsSigmaFunc$sigmaRules4()
{
	//得到八项规则中的某项K值
	var K;
	//得到八项规则中的某项点的颜色
	var color;
	//循环条数的高低值
	var min;
	var max;
	var y,yNext;
	var kj = 0;
	var ud = 0;
	var ischecked;
	for(var i = 0;i<this.sigmaRule.length;i++){
		kj = 0;
		if(this.sigmaRule[i].NO==4)
		{
			K = this.sigmaRule[i].Kvalue;
			color = this.sigmaRule[i].color;
			ischecked = this.sigmaRule[i].ischecked;
		}
	}
	if(!ischecked)
	{
		return;
	}
    for(var i = 0;i<this.checkDataSries.length;i++){
        min = this.checkDataSries[i].min;
        max = this.checkDataSries[i].max;
		for(var j = min;j<max;j++)
		{
		    y = this.sigmaArray[j].y;
		    if(j+1!=max)
		    {
		    yNext = this.sigmaArray[j+1].y;
		    }else{ break; }
		    var udtemp = 0;
		    if(y<yNext)
		    {
		    	udtemp = 1;
		    }else if(y==yNext)
		    {
		    	kj = 2;
		    }else
		    {
		    	udtemp = -1;
		    }
		    if(ud==0)
				{
					ud=udtemp;
					kj = 2;
				}
				else
				{
					if(ud==udtemp)
					{
						kj=2;
					}
					else
					{
						kj = kj+1;
					}
					ud = udtemp;
				}
				if(kj>K)
				{
					this.sigmaArray[j+1].marker.fillColor = color;
					this.sigmaArray[j+1].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: color,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                        return "4";//当前是第几项规则
                    },
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                }
				}
				
		}
    }	
    return this.sigmaArray;
}

//规则5  连续K+1个点中有K个点落在中心线同一侧的2 sigma计算区以外(报警点为k个点中最后一个点)
function clsSigmaFunc$sigmaRules5()
{
    var sigmaRule2=this.sigmaRuleDetail(5);
    var ischecked = sigmaRule2.ischecked;
    if(!ischecked)
    {
    	return;
    }
    if(sigmaRule2!=null)
    {
        var K = parseInt(sigmaRule2.Kvalue);
        var min,max,xBar,y;
        var kmin, kmax,isigma;
        var up=0;
        var down=0;
        var zp=0;
        for(var i = 0;i<this.checkDataSries.length;i++){
            min = this.checkDataSries[i].min;
            max = this.checkDataSries[i].max;
            xBar = this.checkDataSries[i].xBar;
            isigma=this.checkDataSries[i].Isigma;
            kmin=xBar-2*isigma;
            kmax=xBar+2*isigma;
            for(var jj = min;jj<max;jj++)
            {
                if(jj+K>=max)break;
                up=0;
                down=0;
                zp=0;
                for(var j = jj;j<max;j++)
                {
                    y = this.sigmaArray[j].y;
                    //2 sigma 区域以外
                    if(y>kmax || y<kmin)
                    {
                        if(y<xBar)
                        {
                            up = up+1;
                        }else
                        {
                            down = down+1;
                        }
                    }else{
                        zp=zp+1;
                    }
                    if(up+down+zp==K+1)
                    {
                        if(up==K)
                        {
                            for(var inx=0;inx<=K;inx++)
                            {

                                if((this.sigmaArray[j-inx].y<kmin || this.sigmaArray[j-inx].y>kmax) &&  this.sigmaArray[j-inx].y<xBar)
                                {
                                    this.sigmaArray[j-inx].marker.fillColor = sigmaRule2.color;
                                    this.sigmaArray[j-inx].dataLabels={
                    					enabled: true,
                    					align: 'top',
                    					color: sigmaRule2.color,//与此规则对应点的颜色一致
                    					style:{fontSize:16},
                    					crop: false,
                    					formatter:function(){
                        				return "5";//当前是第几项规则
                    						},
                    					verticalAlign: 'middle',
                    					x:-10,
                    					y: -10
                					}
                                    break;
                                }
                            }
                        }
                        if(down==K)
                        {
                            for(var inx=0;inx<=K;inx++)
                            {
                                if((this.sigmaArray[j-inx].y<kmin || this.sigmaArray[j-inx].y>kmax) && this.sigmaArray[j-inx].y>xBar)
                                {
                                    this.sigmaArray[j-inx].marker.fillColor = sigmaRule2.color;
                                    this.sigmaArray[j-inx].dataLabels={
                    					enabled: true,
                    					align: 'top',
                    					color: sigmaRule2.color,//与此规则对应点的颜色一致
                    					style:{fontSize:16},
                    					crop: false,
                    					formatter:function(){
                        				return "5";//当前是第几项规则
                    						},
                    					verticalAlign: 'middle',
                    					x:-10,
                    					y: -10
                					}
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    return this.sigmaArray;
}

//规则6   连续K+1个点中有K个点落在中心线同一侧的1 sigma计算区以外(报警点为k个点中最后一个点)
function clsSigmaFunc$sigmaRules6()
{
    var sigmaRule2=this.sigmaRuleDetail(6);
    var ischecked = sigmaRule2.ischecked;
    if(!ischecked)
    {
    	return;
    }
    if(sigmaRule2!=null)
    {
        var K = parseInt(sigmaRule2.Kvalue);
        var min,max,xBar,y;
        var kmin, kmax,isigma;
        var up=0;
        var down=0;
        var zp=0;
        for(var i = 0;i<this.checkDataSries.length;i++){
            min = this.checkDataSries[i].min;
            max = this.checkDataSries[i].max;
            xBar = this.checkDataSries[i].xBar;
            isigma=this.checkDataSries[i].Isigma;
            kmin=xBar-isigma;
            kmax=xBar+isigma;
            up=0;
            down=0;
            zp=0;
            for(var jj = min;jj<max;jj++)
            {
                if(jj+K>=max)break;
                up=0;
                down=0;
                zp=0;
                for(var j = jj;j<max;j++)
                {
                    y = this.sigmaArray[j].y;
                    //1 sigma 区域以外
                    if(y>kmax || y<kmin)
                    {
                        if(y<xBar)
                        {
                            up = up+1;
                        }else if(y==xBar)
                        {
                             zp=zp+1;
                        }else
                        {
                            down = down+1;
                        }
                    }else{
                        zp=zp+1;
                    }
                    if(up+down+zp==K+1)
                    {
                        if(up==K)
                        {
                            for(var inx=0;inx<=K;inx++)
                            {
                                if((this.sigmaArray[j-inx].y<kmin || this.sigmaArray[j-inx].y>kmax) && this.sigmaArray[j-inx].y<xBar)
                                {
                                    this.sigmaArray[j-inx].marker.fillColor = sigmaRule2.color;
                                    this.sigmaArray[j-inx].dataLabels={
                    					enabled: true,
                    					align: 'top',
                    					color: sigmaRule2.color,//与此规则对应点的颜色一致
                    					style:{fontSize:16},
                    					crop: false,
                    					formatter:function(){
                        				return "6";//当前是第几项规则
                    						},
                    					verticalAlign: 'middle',
                    					x:-10,
                    					y: -10
                					}
                                    break;
                                }
                            }
                        }
                        if(down==K)
                        {
                            for(var inx=0;inx<=K;inx++)
                            {
                                if((this.sigmaArray[j-inx].y<kmin || this.sigmaArray[j-inx].y>kmax) && this.sigmaArray[j-inx].y>xBar)
                                {
                                    this.sigmaArray[j-inx].marker.fillColor = sigmaRule2.color;
                                    this.sigmaArray[j-inx].dataLabels={
                    					enabled: true,
                    					align: 'top',
                    					color: sigmaRule2.color,//与此规则对应点的颜色一致
                    					style:{fontSize:16},
                    					crop: false,
                    					formatter:function(){
                        				return "6";//当前是第几项规则
                    						},
                    					verticalAlign: 'middle',
                    					x:-10,
                    					y: -10
                					}
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    return this.sigmaArray;
}

//规则7连续K点落在1sigma计算区----K=15  15>=K>=12
function clsSigmaFunc$sigmaRules7()
{
	//得到八项规则中的某项K值
	var K;
	//得到八项规则中的某项点的颜色
	var color;
	//循环条数的高低值
	var min;
	var max;
	var y,yNext;
	var Kmin;
	var Kmax;
	var Isigma;
	var xBar;
	var ischecked;
	for(var i = 0;i<this.sigmaRule.length;i++){
		if(this.sigmaRule[i].NO==7)
		{
			K = this.sigmaRule[i].Kvalue;
			color = this.sigmaRule[i].color;
			ischecked = this.sigmaRule[i].ischecked;
		}
	}
	if(!ischecked)
	{
		return;
	}
	//步长
	var step = 0;
    for(var i = 0;i<this.checkDataSries.length;i++){
    	step = 0;
        min = this.checkDataSries[i].min;
        max = this.checkDataSries[i].max;
        xBar = this.checkDataSries[i].xBar;
        Isigma = this.checkDataSries[i].Isigma;
        Kmin = xBar-K*Isigma;
		Kmax = xBar+K*Isigma;
		for(var j = min;j<max;j++)
		{
			y = this.sigmaArray[j].y;
			if(y>=Kmin&&y<=Kmax)
			{
				step = step + 1;
			}else{
				step = 0;
			}
			if(step>=K)
			{
				this.sigmaArray[j].marker.fillColor = color;
                this.sigmaArray[j].dataLabels={
                    enabled: true,
                    align: 'top',
                    color: color,//与此规则对应点的颜色一致
                    style:{fontSize:16},
                    crop: false,
                    formatter:function(){
                    return "7";//当前是第几项规则
                    	},
                    verticalAlign: 'middle',
                    x:-10,
                    y: -10
                	}
			}
		}
    }	
    return this.sigmaArray;	
}

//规则8    连续K 点落在中线两侧且无一在1sigma计算区
function clsSigmaFunc$sigmaRules8()
{
    var sigmaRule2=this.sigmaRuleDetail(8);
    var ischecked = sigmaRule2.ischecked;
    if(!ischecked)
    {
    	return;
    }
    if(sigmaRule2!=null)
    {
        var K = sigmaRule2.Kvalue;
        var min,max,xBar,y;
        var kmin, kmax,isigma;
        var up=0;
        var down=0;
        for(var i = 0;i<this.checkDataSries.length;i++){
            min = this.checkDataSries[i].min;
            max = this.checkDataSries[i].max;
            xBar = this.checkDataSries[i].xBar;
            isigma=this.checkDataSries[i].Isigma;
            kmin=xBar-isigma;
            kmax=xBar+isigma;
            up=0;
            down=0;
            for(var jj = min;jj<max;jj++)
            {
                if(jj+K-1>=max)break;
                up=0;
                down=0;
                for(var j = jj;j<max;j++)
                {
                    y = this.sigmaArray[j].y;
                    //1 sigma 区域以外 连续的K个点
                    if(y>kmax || y<kmin)
                    {
                        if(y<xBar)
                        {
                            up = up+1;
                        }else if(y==xBar)
                        {
                            up=0;
                            down=0;
                        }else
                        {
                            down = down+1;
                        }
                        if(up+down==K && up>0 && down>0)
                        {
                            this.sigmaArray[j].marker.fillColor = sigmaRule2.color;
                            this.sigmaArray[j].dataLabels={
                    			enabled: true,
                    			align: 'top',
                    			color: sigmaRule2.color,//与此规则对应点的颜色一致
                    			style:{fontSize:16},
                    			crop: false,
                    			formatter:function(){
                    			return "8";//当前是第几项规则
                    				},
                    			verticalAlign: 'middle',
                    			x:-10,
                    			y: -10
                				}
                            break;
                        }
                    }else{
                        up=0;
                        down=0;
                    }
                }
            }
        }
    }
    return this.sigmaArray;
}
