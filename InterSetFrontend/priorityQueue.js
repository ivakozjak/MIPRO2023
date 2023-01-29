// a priority queue
function PriorityQueue () {
    this.swap = function (idx, idx2) {
        var self = this;
        if ((idx === idx2) || !self.data[idx] || !self.data[idx2] )return;
        // swap
        var tmp = self.data[idx2];
        self.data[idx2] = self.data[idx];
        self.data[idx] = tmp; 
    };
    this.push = function (key, obj) {
        // push key, obj to the end of the heap and bubble it upward
        var self = this;
        self.data.push({'priority' : key, 'obj': obj});
        // heapify upward
        var idx = self.data.length - 1;
        if (idx > 0) {
            var idx2 = Math.floor((idx-1)/2);

            while ((idx2 >= 0 && self.data[idx2].priority > self.data[idx].priority) || (idx2 >= 0 && (self.data[idx2].priority == self.data[idx].priority) && (self.data[idx2].obj.length>self.data[idx].obj.length))) {
                // swap
                self.swap(idx, idx2);
                idx = idx2;
                // move up the heap array if required
                idx2 = Math.floor((idx-1)/2);
            };
        }
    };
	
	this.length = function(){
		
		return this.data.length;
		
	};
	
	this.contains = function(path){
		var indxE = this.data.length - 1;
		var indxS = 0;
		
		if (indxE > 0) {
           while(indxS<=indxE){
			   var mid = Math.floor((indxS+indxE)/2);
			   if(path.priority == this.data[mid]){
				   var tmpInd = mid;
				   
				   while(this.data[tmpInd].priority == path.priority){
					   var eq=1;
						for(var j=0;j<this.data[tmpInd].obj.length;j++){
								if(this.data[tmpInd].obj[j]!=path[j]){
									eq=0;
									break;
								}
						}
						 if(eq==1)
							   return true;
						   
						   tmpInd=tmpInd+1;
						   if(tmpInd>this.data.length)
							   break;
						   
				   }
				   
				   tmpInd=mid-1;
				   
				   while(this.data[tmpInd].priority == path.priority){
					   var eq=1;
						for(var j=0;j<this.data[tmpInd].obj.length;j++){
								if(this.data[tmpInd].obj[j]!=path[j]){
									eq=0;
									break;
								}
						}
						 if(eq==1)
							   return true;
						   
						   tmpInd=tmpInd-1;
						   if(tmpInd<0)
							   break;
				   }
				   return false;
			   }
			   else if(path.priority<this.data[mid].priority){
				   indxE = mid-1;
			   }
			   else{
				   indxS = mid+1;
			   }
		   }
        }
		else return false;
		
		if(indxS>indxE)
			return false;
	};
	
    this.pop = function () {
        // give from the top
	var self = this;

        var len = self.data.length
        if (!len) {
            return null;
        } else if (len === 1) {
            return self.data.pop().obj;
        }
        self.swap(0, len -1)
        var ret = self.data.pop().obj;

        // heapify downward
        var idx = 0;
        var lf = 2*idx + 1;
        var rt = lf + 1;
        while (true) {
            // rt cld present
            if (rt >= self.data.length) {
                // lf cld present
                if (lf >= self.data.length) {
                    // no child is present
                    break;
                } else {
                    // only lf cld present
                    // swap
                    self.swap(idx, lf);
                    break;
                }
            } else {
                // both cld present
                if (self.data[lf].priority < self.data[rt].priority) {
                    // left smaller
                    // swap
					
					var minDatL=self.data[lf].obj.length;
					var tind=lf, pr = self.data[lf].priority, minInd;
					
					while(self.data[tind].priority == pr){
							if(self.data[tind].obj.length<minDatL){
									minDatL = self.data[tind].obj.length;
									minInd=tind;
							}
							tind = tind+1;
							if(tind>self.data.length-1)
								break;
					}
					
					tind=lf;
					
					while(self.data[tind].priority == pr){
							if(self.data[tind].obj.length<minDatL){
									minDatL = self.data[tind].obj.length;
									minInd=tind;
							}
							tind = tind-1;
							if(tind<0)
								break;
					}
					
					//lf=minInd;
					self.swap(minInd,lf);
                    self.swap(idx, lf);
                    idx = lf;
                    // move up the heap array if required
                    lf = 2*idx + 1;
                    rt = lf + 1;
                } else {
                    // right smaller
                    // swap
					
					
					var minDatL=self.data[rt].obj.length;
					var tind=rt, pr = self.data[rt].priority, minInd;
					
					while(self.data[tind].priority == pr){
							if(self.data[tind].obj.length<minDatL){
									minDatL = self.data[tind].obj.length;
									minInd=tind;
							}
							tind = tind+1;
							if(tind>self.data.length-1)
								break;
					}
					
					tind=rt;
					
					while(self.data[tind].priority == pr){
							if(self.data[tind].obj.length<minDatL){
									minDatL = self.data[tind].obj.length;
									minInd=tind;
							}
							tind = tind-1;
							if(tind<0)
								break;
					}
					
					//rt=minInd;
					self.swap(minInd,rt);
                    self.swap(idx, rt);
                    idx = rt;
                    // move up the heap array if required
                    rt = 2*idx + 2;
                    lf = rt - 1;
                }
            }
        }; 
        return ret;
    };
    this.data = [];
}