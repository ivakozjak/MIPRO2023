boxplot(as.vector(supp1), as.vector(supp2), as.vector(supp3),as.vector(supp4),horizontal=TRUE, names=c("[5,10]", "[11,39]","[40,99]","[100,300]"),xlab="Entropy",ylab="Support interval",col=c("red","orange","cyan","blue"),main="Entropy of level of dementia in described patients")

pl <- barchart(newsuppSmall4,scales=list(cex=1.5, cex.axis=3),
               +                stack=TRUE, xlab = "Count",auto.key = list(adj = 1,title="Redescriptions with support in [100,300]",cex=2),box.width = 0.1,cex.label=2)
> plot(pl)
> pl <- barchart(newsuppSmall4,scales=list(cex=1.5, cex.axis=3),
                 +                stack=TRUE, xlab = list("Count",cex=2),auto.key = list(adj = 1,title="Redescriptions with support in [100,300]",cex=2),box.width = 0.1)
> plot(pl)


#barPlotForMultipleFUnctions
barplot(funcTmpData,beside=T,col=c("red","red","red","blue","pink","green"),xlab="Functions",names=c("GO0046352","GO0043447","GO0006694","GO0006631","GO0000003","GO0043093","GO0034622","GO0042493","GO0007610","GO0034655","GO0008610","GO0060255","GO0019725","GO0003333","GO0032502"),ylab="AUPRC",legend=c("1-NN","5-NN","10-NN","GFP","RFDist","RFFN"),args.legend= list(title = "Methods", x = "topright", cex = .7))

#violin plot code
my.vioplot1(MethodViolinComparisonR[,1],MethodViolinComparisonR[,2],MethodViolinComparisonR[,3],MethodViolinComparisonR[,4],MethodViolinComparisonR[,5],MethodViolinComparisonR[,6],col=c("red","red","red","blue","pink","green"),names=c("1-NN","5-NN","10-NN","GFP","RFL","RFFN"))


#RUMICurve
plot(firstset8$RU, firstset8$MI,type="o",col="green")
points(firstset6$RU,firstset6$MI,type="o",col="blue")
points(firstset$RU,firstset$MI,type="o",col="red")
points(firstset3$RU,firstset3$MI,type="o",col="black")
points(firstset5$RU,firstset5$MI,type="o",col="orange")
points(firstset4$RU,firstset4$MI,type="o",col="purple")
legend("topright", legend = c("1-NN","5-NN","10-NN","GFP", "RFL","RFFN"), fill=c("red","blue","green","orange","purple","black"))

#Different k plot
plot(c(1,2,3,4,5,6,7,8,9,10),knnauprc,type="o",ylim=c(0.1,0.4),ylab="AUPRC",xlab="Number of neighbours")
lines(c(1,2,3,4,5,8,10),fnauprc, type="o", col="red")

#Plot enrichment histograms
bp1<-barplot(vec1,beside=T,col=rainbow(10),ylim=c(0,0.18),legend=c("CLPar","CL","MED","DIST","AllBP","ORAll","ORNCLPar","ORNCL","DIFFNCLPar","DIFFNCL"),args.legend= list(title = "Divisions", x = "topleft", cex = .7),names=c("46352"),ylab="AUPRC",xlab="Functions")
error.bar(bp1,vec1,vecsdSE)

sdss<-createavgSds(d3); #d3 is a input file
y=matrix(sdss[1,],c(11,19));
bp1<-barplot(y,beside=T,col=rainbow(11),ylim=c(0,1.0),legend=c("CLPar","CL/CLPar","CL","MED","DIST","AllBP","ORAll","ORNCLPar","ORNCL","DIFFNCLPar","DIFFNCL"),args.legend= list(title = "Methods", x = "topright", cex = .7),names=c("46352","43447","6694","6631","3","43093","34622","42493","7610","34655","8610","60255","19725","3333","32502","9266","51128","60255","272"),ylab="AUPRC",xlab="Functions")
error.bar(bp1,sdss[1,],sdss[2,]/sqrt(200))

#plot cdf for qs
library(lattice)
library(latticeExtra)
ecdfplot(ltmp)

#drawing redescription set table
library(lattice)
supSmall1F<-createRedescriptionTableF(RowLabels,DementiaLevels,`5to10shortDist`);
newsuppSmall1<-supSmall1F[1:9,];
pl <- barchart(supSmall1F[2:10,],scales=list(cex=1.2),
nwsP1<-newsuppSmall1;
pl <- barchart(nwsP1,scales=list(cex=1.3),stack=TRUE, xlab = list("Count",cex=1.5),auto.key = list(adj = 1,title="Redescriptions with support in [100,300]",cex=1.5),box.width = 0.1)
rownames(nwsP1)[4]<-"MidTemp >= 11204.0 <= 15483.0 AND HMT7 >= 4.14 <= 6.58 AND Entorhinal >= 1443.0 <= 2170.0 \n EcogPtOrgan >= 0.28 <= 1.63 AND attentionMoca >= 0.0 <= 0.62 \n JS: 1.0, p-value: 2.7e-13"
