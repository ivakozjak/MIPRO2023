package com.example.interset.controller;

import com.example.interset.model.DataBaseEnum;
import com.example.interset.service.RedescriptionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.json.simple.JSONObject;

import java.util.Map;

@RestController
@RequestMapping("/phenotype")
public class PhenotypeRedescriptionsController {
    RedescriptionsService redescriptionsService;

    @Autowired
    public PhenotypeRedescriptionsController(RedescriptionsService redescriptionsService) {
        this.redescriptionsService = redescriptionsService;
    }

    @PostMapping(value="/somData")
    public void somData(@RequestBody JSONObject request){
        redescriptionsService.somData(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/somDataBack")
    public void somDataBack(@RequestBody JSONObject request){
        redescriptionsService.somDataBack(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/somData")
    public JSONObject somDataGet(){
        return redescriptionsService.somDataGet(DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/login")
    public JSONObject login(@RequestBody JSONObject request){
        return redescriptionsService.login(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/checkRegInfo")
    public JSONObject checkRegInfo(@RequestBody JSONObject request){
        return redescriptionsService.checkRegInfo(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/register")
    public void register(@RequestBody JSONObject request){
        redescriptionsService.register(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redescriptionElement")
    public JSONObject redescriptionElement(){
        return redescriptionsService.redescriptionElement(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redundancyAll")
    public JSONObject redundancyAll(){
        return redescriptionsService.redundancyAll(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redundancySupp")
    public JSONObject redundancySupp(){
        return redescriptionsService.redundancySupp(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redundancyAttrs")
    public JSONObject redundancyAttrs(){
        return redescriptionsService.redundancyAttrs(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redundancyinfo")
    public JSONObject redundancyinfo(@RequestParam Map<String,String> request){
        return redescriptionsService.redundancyinfo(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redundancyinfo1")
    public JSONObject redundancyinfo1(@RequestParam Map<String,String> request){
        return redescriptionsService.redundancyinfo1(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redescriptions")
    public JSONObject redescriptions(@RequestParam Map<String,String> request){
        return redescriptionsService.redescriptions(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redescriptionsSel")
    public JSONObject redescriptionsSel(@RequestParam Map<String,String> request){
        return redescriptionsService.redescriptionsSel(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redescriptionsBack")
    public JSONObject redescriptionsBack(@RequestParam Map<String,String> request){
        return redescriptionsService.redescriptionsBack(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/clusterinfo")
    public JSONObject clusterinfo(@RequestParam Map<String,String> request){
        return redescriptionsService.clusterinfo(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/clusterinfosel")
    public JSONObject clusterinfosel(@RequestParam Map<String,String> request){
        return redescriptionsService.clusterinfosel(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/clusterinfoBack")
    public JSONObject clusterinfoBack(){
        return redescriptionsService.clusterinfoBack(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redescriptionInfo")
    public JSONObject redescriptionInfo(@RequestParam Map<String,String> request){
        return redescriptionsService.redescriptionInfo(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/redescriptionSupport")
    public JSONObject redescriptionSupport(@RequestParam Map<String,String> request){
        return redescriptionsService.redescriptionSupport(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/allRedescriptions")
    public JSONObject allRedescriptions(){
        return redescriptionsService.allRedescriptions(DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/graphData")
    public void graphData(@RequestBody JSONObject request){
        redescriptionsService.graphData(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/graphDataG")
    public void graphDataG(@RequestBody JSONObject request){
        redescriptionsService.graphDataG(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/graphDataAttr")
    public void graphDataAttr(@RequestBody JSONObject request){
        redescriptionsService.graphDataAttr(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/graphDataAttrG")
    public void graphDataAttrG(@RequestBody JSONObject request){
        redescriptionsService.graphDataAttrG(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/numReds")
    public JSONObject numReds(){
        return redescriptionsService.numReds(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/graphData")
    public JSONObject graphDataGet(@RequestParam Map<String,String> request){
        return redescriptionsService.graphDataGet(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/graphDataAttrGet")
    public JSONObject graphDataAttrGet(@RequestParam Map<String,String> request){
        return redescriptionsService.graphDataAttrGet(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/attrFreq")
    public void attrFreq(@RequestBody JSONObject request){
        redescriptionsService.attrFreq(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/sharedData")
    public void sharedData(@RequestBody JSONObject request){
        redescriptionsService.sharedData(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/sharedDataGet")
    public JSONObject sharedDataGet(@RequestParam Map<String,String> request){
        return redescriptionsService.sharedDataGet(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/checkTable")
    public JSONObject checkTable(){
        return redescriptionsService.checkTable(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/checkTableAttrs")
    public JSONObject checkTableAttrs(){
        return redescriptionsService.checkTableAttrs(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/initatData")
    public JSONObject initatData(){
        return redescriptionsService.initatData(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/attributeData")
    public JSONObject attributeData(){
        return redescriptionsService.attributeData(DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/attributeCoocurence")
    public JSONObject attributeCoocurence(@RequestParam Map<String,String> request) {
        //System.out.println(allParams.entrySet());
        //System.out.println("offset cols: " + allParams.get("offsetCol"));
        System.out.println(request);
        return redescriptionsService.attributeCoocurence(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/attributeRedescriptions")
    public JSONObject attributeRedescriptions(@RequestParam Map<String,String> request){
        return redescriptionsService.attributeRedescriptions(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/attributeRedescriptionsSel")
    public JSONObject attributeRedescriptionsSel(@RequestParam Map<String,String> request){
        return redescriptionsService.attributeRedescriptionsSel(request, DataBaseEnum.PHENOTYPE);
    }

    @GetMapping(value="/clusrmSettings")
    public JSONObject clusrmSettings(@RequestParam Map<String,String> request){
        return redescriptionsService.clusrmSettings(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/clusrmSettingsElements")
    public JSONObject clusrmSettingsElements(@RequestBody JSONObject request){
        return redescriptionsService.clusrmSettingsElements(request, DataBaseEnum.PHENOTYPE);
    }

    @PostMapping(value="/saveCLUSRMRedescriptions")
    public JSONObject saveCLUSRMRedescriptions(@RequestBody JSONObject request){
        return redescriptionsService.saveCLUSRMRedescriptions(request, DataBaseEnum.PHENOTYPE);
    }
}
