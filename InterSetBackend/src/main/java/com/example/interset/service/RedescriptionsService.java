package com.example.interset.service;

import com.example.interset.model.DataBaseEnum;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import com.example.interset.repository.RedescriptionsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Map;

@Service

public class RedescriptionsService {
    RedescriptionsRepository redescriptionsRepository;
    Logger logger = LoggerFactory.getLogger(RedescriptionsService.class);
    JSONParser jsonParser = new JSONParser();

    @Autowired
    public RedescriptionsService(RedescriptionsRepository redescriptionsRepository) {
        this.redescriptionsRepository = redescriptionsRepository;
    }

    public Object somData(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.somData(request, database);
    }

    public Object somDataBack(JSONObject request, DataBaseEnum database){
        logger.info("parameters: ");
        logger.info(request.get("SomDat").toString());
        logger.info(request.get("ElCov").toString());
        logger.info(request.get("NumRows").toString());
        logger.info(request.get("NumCols").toString());

        return redescriptionsRepository.somDataBack(request, database);
    }

    public JSONObject somDataGet(DataBaseEnum database){
        logger.info("GET Som data called! ");

        JSONObject res = new JSONObject();
        res.put("somData", new ArrayList<>());
        return res;
    }

    public JSONObject login(JSONObject request, DataBaseEnum database){
        JSONObject userInfo = null;
        try {
            userInfo = (JSONObject) jsonParser.parse(String.valueOf(request.get("userInfo")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        logger.info(userInfo.get("username").toString());
        logger.info(userInfo.get("password").toString());

        return redescriptionsRepository.login(request, database);
    }

    public JSONObject checkRegInfo(JSONObject request, DataBaseEnum database){
        JSONObject userInfo = null;
        try {
            userInfo = (JSONObject) jsonParser.parse(String.valueOf(request.get("userInfo")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        logger.info(userInfo.get("username").toString());
        logger.info(userInfo.get("password").toString());

        return redescriptionsRepository.checkRegInfo(request, database);
    }

    public Object register(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.register(request, database);
    }

    public JSONObject redescriptionElement(DataBaseEnum database){

        return redescriptionsRepository.redescriptionElement(database);
    }

    public JSONObject redundancyAll(DataBaseEnum database){
        logger.info("redundancyAll called!");

        return redescriptionsRepository.redundancyAll(database);
    }

    public JSONObject redundancySupp(DataBaseEnum database){

        return redescriptionsRepository.redundancySupp(database);
    }

    public JSONObject redundancyAttrs(DataBaseEnum database){

        return redescriptionsRepository.redundancyAttrs(database);
    }

    public JSONObject redundancyinfo(Map<String,String> request, DataBaseEnum database){

        logger.info("rest called!");
        return redescriptionsRepository.redundancyinfo(request, database);
    }

    public JSONObject redundancyinfo1(Map<String,String> request, DataBaseEnum database){

        logger.info("rest called!");
        return redescriptionsRepository.redundancyinfo1(request, database);
    }

    public JSONObject redescriptions(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.redescriptions(request, database);
    }

    public JSONObject redescriptionsSel(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.redescriptionsSel(request, database);
    }

    public JSONObject redescriptionsBack(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.redescriptionsBack(request, database);
    }

    public JSONObject clusterinfo(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.clusterinfo(request, database);
    }

    public JSONObject clusterinfosel(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.clusterinfosel(request, database);
    }

    public JSONObject clusterinfoBack(DataBaseEnum database){

        return redescriptionsRepository.clusterinfoBack(database);
    }

    public JSONObject redescriptionInfo(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.redescriptionInfo(request, database);
    }

    public JSONObject redescriptionSupport(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.redescriptionSupport(request, database);
    }

    public JSONObject allRedescriptions(DataBaseEnum database){

        return redescriptionsRepository.allRedescriptions(database);
    }

    public Object graphData(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.graphData(request, database);
    }

    public Object graphDataG(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.graphDataG(request, database);
    }

    public Object graphDataAttr(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.graphDataAttr(request, database);
    }

    public Object graphDataAttrG(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.graphDataAttrG(request, database);
    }

    public JSONObject numReds(DataBaseEnum database){

        return redescriptionsRepository.numReds(database);
    }

    public JSONObject graphDataGet(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.graphDataGet(request, database);
    }

    public JSONObject graphDataAttrGet(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.graphDataAttrGet(request, database);
    }

    public Object attrFreq(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.attrFreq(request, database);
    }

    public Object sharedData(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.sharedData(request, database);
    }

    public JSONObject sharedDataGet(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.sharedDataGet(request, database);
    }

    public JSONObject checkTable(DataBaseEnum database){

        return redescriptionsRepository.checkTable(database);
    }

    public JSONObject checkTableAttrs(DataBaseEnum database){

        return redescriptionsRepository.checkTableAttrs(database);
    }

    public JSONObject initatData(DataBaseEnum database){

        return redescriptionsRepository.initatData(database);
    }

    public JSONObject attributeData(DataBaseEnum database){

        return redescriptionsRepository.attributeData(database);
    }

    public JSONObject attributeCoocurence(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.attributeCoocurence(request, database);
    }

    public JSONObject attributeRedescriptions(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.attributeRedescriptions(request, database);
    }

    public JSONObject attributeRedescriptionsSel(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.attributeRedescriptionsSel(request, database);
    }

    public JSONObject clusrmSettings(Map<String,String> request, DataBaseEnum database){

        return redescriptionsRepository.clusrmSettings(request, database);
    }

    public JSONObject clusrmSettingsElements(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.clusrmSettingsElements(request, database);
    }

    public JSONObject saveCLUSRMRedescriptions(JSONObject request, DataBaseEnum database){

        return redescriptionsRepository.saveCLUSRMRedescriptions(request, database);
    }
}
