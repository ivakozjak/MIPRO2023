package com.example.interset.repository;

import com.example.interset.model.DataBaseEnum;
import org.springframework.stereotype.Repository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.text.DecimalFormat;
import java.util.*;

import static java.lang.Float.isNaN;
import static org.junit.Assert.assertArrayEquals;

@Repository
public class RedescriptionsRepository {

    public String selectedAttrs = "";

    public String getSelectedAttrs() {
        return selectedAttrs;
    }

    private Connection connect(String databaseName) throws SQLException {
        String url = "jdbc:sqlite:/Users/ivakozjak/Desktop/interset/src/main/resources/" + databaseName;
        Connection conn = DriverManager.getConnection(url);
        return conn;
    }
    public Object somData(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        Long userId = null, numRows = null, numCols = null;
        String numRowsString = "", numColsString = "";
        JSONArray somDat = new JSONArray();
        JSONArray  elCov = new JSONArray();
        JSONArray  selReds = new JSONArray();
        try {
            userId = (Long) jsonParser.parse(String.valueOf(request.get("userId")));
            if(jsonParser.parse(String.valueOf(request.get("numRows"))) instanceof String) {
                numRowsString = (String) jsonParser.parse(String.valueOf(request.get("numRows")));
                numRows = Long.parseLong(numRowsString);
            }
            else if (jsonParser.parse(String.valueOf(request.get("numRows"))) instanceof Long)
                numRows = (Long) jsonParser.parse(String.valueOf(request.get("numRows")));

            if(jsonParser.parse(String.valueOf(request.get("numCols"))) instanceof String) {
                numColsString = (String) jsonParser.parse(String.valueOf(request.get("numCols")));
                numCols = Long.parseLong(numColsString);
            }
            else if (jsonParser.parse(String.valueOf(request.get("numCols"))) instanceof Long)
                numCols = (Long) jsonParser.parse(String.valueOf(request.get("numCols")));

            somDat = (JSONArray) jsonParser.parse(String.valueOf(request.get("somDat")));
            elCov = (JSONArray) jsonParser.parse(String.valueOf(request.get("elCov")));
            selReds = (JSONArray) jsonParser.parse(String.valueOf(request.get("selReds")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);
                stmt.execute("DELETE FROM SOMClusters where userId = "+userId);
                stmt.execute("DELETE FROM SomDimensions where userId = "+userId);
                stmt.execute("DELETE FROM ElementCoverage where userId = "+userId);
                stmt.execute("DELETE FROM SelectedRedescriptionsElem where userId = "+userId);

                PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO SomDimensions VALUES (?,?,?)");
                insertPstmt.setLong(1, userId);
                insertPstmt.setLong(2, numRows);
                insertPstmt.setLong(3, numCols);
                insertPstmt.executeUpdate();

                JSONArray somClusters = somDat;
                Iterator<JSONObject> iterator = somClusters.iterator();
                Integer i = 0;
                while(iterator.hasNext()){
                    i++;
                    JSONObject cluster = iterator.next();
                    JSONObject neighbors = (JSONObject) cluster.get("neighbors");
                    JSONArray nbDefaultList = (JSONArray) neighbors.get("default");
                    if(nbDefaultList != null)
                    {
                        Iterator<JSONObject> iterator1 = nbDefaultList.iterator();
                        while(iterator1.hasNext()){
                            JSONObject nbDefault = iterator1.next();
                            insertPstmt = conn.prepareStatement("INSERT INTO SomClusters VALUES (?,?,?)");
                            insertPstmt.setLong(1, userId);
                            insertPstmt.setString(2, (String)nbDefault.get("id"));
                            insertPstmt.setInt(3, i);
                            insertPstmt.executeUpdate();
                        }
                    }

                }

                JSONArray elementCoverage = elCov;
                Iterator<JSONObject> iterator2 = elementCoverage.iterator();
                while(iterator2.hasNext()){
                    JSONObject element = iterator2.next();
                    insertPstmt = conn.prepareStatement("INSERT INTO ElementCoverage VALUES (?,?,?)");
                    insertPstmt.setLong(1, userId);
                    insertPstmt.setLong(2, (Long) element.get("name"));
                    insertPstmt.setLong(3, (Long) element.get("count"));
                    insertPstmt.executeUpdate();
                }

                Iterator<Long> iterator3 = selReds.iterator();
                while(iterator3.hasNext()){
                    insertPstmt = conn.prepareStatement("INSERT INTO SelectedRedescriptionsElem VALUES (?,?)");
                    insertPstmt.setLong(1, userId);
                    insertPstmt.setLong(2, iterator3.next());
                    insertPstmt.executeUpdate();
                }

                conn.commit();
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public Object somDataBack(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        Integer NumRows = null, NumCols = null;
        JSONArray somDat = new JSONArray();
        JSONArray  elCov = new JSONArray();
        JSONArray  selReds = new JSONArray();
        try {
            NumRows = (Integer) jsonParser.parse(String.valueOf(request.get("NumRows")));
            NumCols = (Integer) jsonParser.parse(String.valueOf(request.get("NumCols")));
            somDat = (JSONArray) jsonParser.parse(String.valueOf(request.get("somDat")));
            elCov = (JSONArray) jsonParser.parse(String.valueOf(request.get("elCov")));
            selReds = (JSONArray) jsonParser.parse(String.valueOf(request.get("selReds")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);

                stmt.execute("DELETE FROM SOMClustersBack");
                stmt.execute("DELETE FROM SomDimensionsBack");
                stmt.execute("DELETE FROM ElementCoverageBack");
                stmt.execute("DELETE FROM SelectedRedescriptionsElemBack");

                PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO SomDimensionsBack VALUES (?,?)");
                insertPstmt.setInt(1, NumRows);
                insertPstmt.setInt(2, NumCols);
                insertPstmt.executeUpdate();

                JSONArray somClusters = somDat;
                Iterator<JSONObject> iterator = somClusters.iterator();
                Integer i = 0;
                while(iterator.hasNext()){
                    i++;
                    JSONObject cluster = iterator.next();
                    JSONObject neighbors = (JSONObject) cluster.get("neighbors");
                    JSONArray nbDefaultList = (JSONArray) neighbors.get("default");
                    if(nbDefaultList != null)
                    {
                        Iterator<JSONObject> iterator1 = nbDefaultList.iterator();
                        while(iterator1.hasNext()){
                            JSONObject nbDefault = iterator1.next();
                            insertPstmt = conn.prepareStatement("INSERT INTO SomClustersBack VALUES (?,?)");
                            insertPstmt.setInt(1, (Integer) nbDefault.get("id"));
                            insertPstmt.setInt(2, i);
                            insertPstmt.executeUpdate();
                        }
                    }
                }

                JSONArray elementCoverage = elCov;
                Iterator<JSONObject> iterator2 = elementCoverage.iterator();
                while(iterator2.hasNext()){
                    JSONObject element = iterator2.next();
                    insertPstmt = conn.prepareStatement("INSERT INTO ElementCoverageBack VALUES (?,?)");
                    insertPstmt.setInt(1, (Integer) element.get("name"));
                    insertPstmt.setInt(2, (Integer) element.get("count"));
                    insertPstmt.executeUpdate();
                }

                Iterator<Integer> iterator3 = selReds.iterator();
                while(iterator3.hasNext()){
                    insertPstmt = conn.prepareStatement("INSERT INTO SelectedRedescriptionsElemBack VALUES (?)");
                    insertPstmt.setInt(1, iterator3.next());
                    insertPstmt.executeUpdate();
                }

                conn.commit();
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public JSONObject login(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONObject userInfo = null;
        try {
            userInfo = (JSONObject) jsonParser.parse(String.valueOf(request.get("userInfo")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        JSONObject res = new JSONObject();
        try{
            //System.out.println(request);
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray userInfoList = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT userId, userName from UserTable where userName = "+"\""+userInfo.get("username")+"\""+ "AND password = "+"\""+userInfo.get("password")+"\"");
                while(rs.next())
                {
                    
                    temp.put("userId", rs.getInt("userId"));
                    temp.put("userName", rs.getString("userName"));
                    userInfoList.add(temp);
                    temp = new JSONObject();
                }
                res.put("userInfo", userInfoList);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject checkRegInfo(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONObject userInfo = null;
        try {
            userInfo = (JSONObject) jsonParser.parse(String.valueOf(request.get("userInfo")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        JSONObject res = new JSONObject();
        JSONArray maxIdArr = new JSONArray();
        JSONArray countArr = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                ResultSet userMaxId = stmt.executeQuery("SELECT MAX(userId) as maxId from UserTable");
                while(userMaxId.next()){
                    System.out.println(userMaxId.getInt("maxId"));
                    temp.put("maxId", userMaxId.getInt("maxId"));
                    maxIdArr.add(temp);
                    temp = new JSONObject();
                }
                ResultSet countSet = stmt.executeQuery("SELECT count(*) as count from UserTable where userName =  "+"\""+userInfo.get("username")+"\"");
                while(countSet.next())
                {
                    //System.out.println(countSet.getInt("count"));
                    temp.put("count", countSet.getInt("count"));
                    countArr.add(temp);
                    temp = new JSONObject();
                }
                res.put("maxId", maxIdArr);
                res.put("count", countArr);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public Object register(JSONObject request, DataBaseEnum database){
        Long maxuid = null;
        JSONParser jsonParser = new JSONParser();
        JSONObject userInfo = null;
        try {
            userInfo = (JSONObject) jsonParser.parse(String.valueOf(request.get("userInfo")));
            maxuid = (Long) jsonParser.parse(String.valueOf(request.get("maxUserId")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);

            if(conn != null)
            {
                conn.setAutoCommit(false);

                PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO UserTable VALUES (?,?,?)");
                insertPstmt.setLong(1, maxuid + 1);
                insertPstmt.setString(2, userInfo.get("username").toString());
                insertPstmt.setString(3, userInfo.get("password").toString());
                insertPstmt.executeUpdate();

                conn.commit();
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public JSONObject redescriptionElement(DataBaseEnum database){
        JSONObject res = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONArray array = new JSONArray();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT redescriptionID,elemetID from RedescriptionElementTable");
                while(rs.next())
                {
                    temp.put("id", rs.getInt("redescriptionID"));
                    temp.put("elementID", rs.getInt("elemetID"));
                    array.add(temp);
                    //System.out.println(array);
                    temp = new JSONObject();
                    //if(rs.getInt("redescriptionID") == 2) break;
                }
                res.put("redElems", array);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject redundancyAll(DataBaseEnum database){
        JSONObject res = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONArray redAttr = new JSONArray();
        JSONArray redElems = new JSONArray();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                ResultSet redInfo = stmt.executeQuery("SELECT redescriptionID,elemetID FROM RedescriptionElementTable");
                while(redInfo.next())
                {
                    temp.put("id", redInfo.getInt("redescriptionID"));
                    temp.put("elementID", redInfo.getInt("elemetID"));
                    redElems.add(temp);
                    temp = new JSONObject();
                }
                res.put("redElems", redElems);

                ResultSet attInfo = stmt.executeQuery("SELECT DISTINCT redescriptionID,attributeID FROM RedescriptionAttributeTable");
                while(attInfo.next())
                {
                    temp.put("id", attInfo.getInt("redescriptionID"));
                    temp.put("attributeID", attInfo.getInt("attributeID"));
                    redAttr.add(temp);
                    temp = new JSONObject();
                }
                res.put("redAttr", redAttr);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redundancySupp(DataBaseEnum database){
        JSONObject res = new JSONObject();
        JSONArray redElems = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT redescriptionID,elemetID from RedescriptionElementTable");
                while(rs.next())
                {
                    temp.put("id", rs.getInt("redescriptionID"));
                    temp.put("elementID", rs.getInt("elemetID"));
                    redElems.add(temp);
                    temp = new JSONObject();
                }
                res.put("redElems", redElems);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redundancyAttrs(DataBaseEnum database){
        JSONObject res = new JSONObject();
        JSONArray redAttrs = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT redescriptionID,attributeID from RedescriptionAttributeTable");
                while(rs.next())
                {
                    temp.put("id", rs.getInt("redescriptionID"));
                    temp.put("attributeID", rs.getInt("attributeID"));
                    redAttrs.add(temp);
                    temp = new JSONObject();
                }
                res.put("redAttrs", redAttrs);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redundancyinfo(Map<String,String> request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONArray ids = new JSONArray();
        try {
            ids = (JSONArray) jsonParser.parse(String.valueOf(request.get("ids")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        //System.out.println("ids: " + ids);
        Iterator<JSONObject> iterator1 = ids.iterator();
        Iterator<JSONObject> iterator2 = ids.iterator();

        JSONObject res = new JSONObject();
        JSONArray redAttr = new JSONArray();
        JSONArray redElems = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String redInfoString = "SELECT redescriptionID,elemetID FROM RedescriptionElementTable WHERE redescriptionID=";
                while(iterator1.hasNext()){
                    JSONObject element = iterator1.next();
                    redInfoString = redInfoString + (element.values());
                    if(iterator1.hasNext())
                        redInfoString = redInfoString + " OR redescriptionID=";
                }

                String attInfoString = "SELECT DISTINCT redescriptionID,attributeID FROM RedescriptionAttributeTable WHERE redescriptionID=";
                while(iterator2.hasNext()){
                    JSONObject element = iterator2.next();
                    attInfoString = attInfoString + (element.values());
                    if(iterator2.hasNext())
                        attInfoString = attInfoString + " OR redescriptionID=";
                }

                System.out.println("redundancyInfo called!");

                ResultSet redInfo = stmt.executeQuery(redInfoString);
                while(redInfo.next())
                {
                    temp.put("id", redInfo.getInt(1));
                    temp.put("elementID", redInfo.getInt(2));
                    redElems.add(temp);
                    temp = new JSONObject();
                }
                res.put("redElems", redElems);

                ResultSet attInfo = stmt.executeQuery(attInfoString);
                while(attInfo.next())
                {
                    temp.put("id", attInfo.getInt(1));
                    temp.put("attributeID", attInfo.getInt(2));
                    redAttr.add(temp);
                    temp = new JSONObject();
                }
                res.put("redAttr", redAttr);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redundancyinfo1(Map<String,String> request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONArray ids = new JSONArray();
        try {
            ids = (JSONArray) jsonParser.parse(String.valueOf(request.get("ids")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Iterator<JSONObject> iterator1 = ids.iterator();
        Iterator<JSONObject> iterator2 = ids.iterator();

        JSONObject res = new JSONObject();
        JSONArray redAttr = new JSONArray();
        JSONArray redElems = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String redInfoString = "SELECT redescriptionID,elemetID FROM RedescriptionElementTable WHERE redescriptionID=";
                while(iterator1.hasNext()){
                    JSONObject element = iterator1.next();
                    redInfoString = redInfoString + (element.values());
                    if(iterator1.hasNext())
                        redInfoString = redInfoString + " OR redescriptionID=";
                }
                ResultSet redInfo = stmt.executeQuery(redInfoString);
                while(redInfo.next())
                {
                    temp.put("id", redInfo.getInt(1));
                    temp.put("elementID", redInfo.getInt(2));
                    redElems.add(temp);
                    temp = new JSONObject();
                }
                res.put("redElems", redElems);

                String attInfoString = "SELECT DISTINCT redescriptionID,attributeID FROM RedescriptionAttributeTable WHERE redescriptionID=";
                while(iterator2.hasNext()){
                    JSONObject element = iterator2.next();
                    attInfoString = attInfoString + (element.values());
                    if(iterator2.hasNext())
                        attInfoString = attInfoString + " OR redescriptionID=";
                }
                ResultSet attInfo = stmt.executeQuery(attInfoString);
                while(attInfo.next())
                {
                    temp.put("id", attInfo.getInt(1));
                    temp.put("attributeID", attInfo.getInt(2));
                    redAttr.add(temp);
                    temp = new JSONObject();
                }
                res.put("redAttr", redAttr);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redescriptions(Map<String,String> request, DataBaseEnum database){
        int id, userId;
        if(request.get("id") == null) id = 1;
        else id=Integer.parseInt(request.get("id"));
        userId=Integer.parseInt(request.get("userId"));
        //System.out.println("userId" + userId);
        JSONObject res = new JSONObject();
        JSONArray redescriptions = new JSONArray();
        JSONArray somElements = new JSONArray();
        JSONArray attributeDescriptions = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String redescriptionsInSOMClusterString = "SELECT * FROM RedescriptionTable as rt "+
                        "WHERE rt.redescriptionID IN "+
                        "(SELECT distinct redescriptionID FROM RedescriptionElementTable "+
                        "WHERE elemetID IN (SELECT elementID FROM "+
                        "SOMClusters WHERE SOMClusterID = "+id+
                        " AND userId = "+userId+"))";
                ResultSet redescriptionsInSOMCluster = stmt.executeQuery(redescriptionsInSOMClusterString);
                while(redescriptionsInSOMCluster.next())
                {
                    temp.put("id", redescriptionsInSOMCluster.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[5];
                    tmpArr[0]=redescriptionsInSOMCluster.getString("redescriptionLR");
                    tmpArr[1]=redescriptionsInSOMCluster.getString("redescriptionRR");
                    tmpArr[2]=redescriptionsInSOMCluster.getDouble("redescriptionJS");
                    tmpArr[3]=redescriptionsInSOMCluster.getInt("redescriptionSupport");
                    tmpArr[4]=redescriptionsInSOMCluster.getInt("redescriptionPval");
                    temp.put("data", tmpArr);
                    redescriptions.add(temp);
                    //System.out.println("\n"+ temp);
                    temp = new JSONObject();
                }
                res.put("redescriptions", redescriptions);

                String elementsInSOMClusterString = "SELECT elementID, elementDescription "+
                        "FROM ElementTable WHERE "+
                        "elementID IN "+
                        "(SELECT elementID "+
                        "FROM SOMClusters "+
                        "WHERE SOMClusterID ="+id+" AND userId = "+userId+")";
                ResultSet elementsInSOMCluster = stmt.executeQuery(elementsInSOMClusterString);
                while(elementsInSOMCluster.next())
                {
                    temp.put("id", elementsInSOMCluster.getInt(1));
                    temp.put("name", elementsInSOMCluster.getString(2));
                    somElements.add(temp);
                    temp = new JSONObject();
                }
                res.put("somElements", somElements);

                String attributeDescriptionsInSOMClusterString = ""+
                        "SELECT ra.attributeID, count(ra.attributeID) as count, at.attributeDescription "+
                        "FROM attributeTable as at, RedescriptionAttributeTable as ra "+
                        "WHERE redescriptionID IN (SELECT redescriptionID FROM RedescriptionTable "+
                        "WHERE redescriptionID IN "+
                        "(SELECT distinct redescriptionID FROM RedescriptionElementTable "+
                        "WHERE elemetID IN (SELECT elementID FROM "+
                        "SOMClusters WHERE SOMClusterID = "+id+" AND userId = "+userId+")))"+
                        "AND ra.attributeID = at.attributeID GROUP BY ra.attributeID";
                ResultSet attributeDescriptionsInSOMCluster = stmt.executeQuery(attributeDescriptionsInSOMClusterString);
                while(attributeDescriptionsInSOMCluster.next())
                {
                    temp.put("id", attributeDescriptionsInSOMCluster.getInt("attributeID"));
                    Object[] tmpArr1 = new Object[2];
                    tmpArr1[0]=attributeDescriptionsInSOMCluster.getInt("count");
                    tmpArr1[1]=attributeDescriptionsInSOMCluster.getString("attributeDescription");
                    temp.put("data", tmpArr1);
                    attributeDescriptions.add(temp);
                    temp = new JSONObject();
                }
                res.put("attributeDescriptions", attributeDescriptions);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject redescriptionsSel(Map<String ,String> request, DataBaseEnum database) {
        int userId, id;
        userId=Integer.parseInt(request.get("userId"));
        if(request.get("id")==null) id = 1;
        else id=Integer.parseInt(request.get("id"));

        JSONObject res = new JSONObject();
        JSONArray redescriptions = new JSONArray();
        JSONArray somElements = new JSONArray();
        JSONArray attributeDescriptions = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String redescriptionsInSOMClusterString = "SELECT * FROM RedescriptionTable as rt "+
                        "WHERE rt.redescriptionID IN "+
                        "(SELECT distinct redescriptionID FROM RedescriptionElementTable "+
                        "WHERE elemetID IN (SELECT elementID FROM "+
                        "SOMClusters WHERE SOMClusterID = "+id+
                        " AND userId = "+userId+") AND redescriptionID IN " +
                        "(SELECT redescriptionID FROM SelectedRedescriptionsElem WHERE userId = "+userId+"))";
                ResultSet redescriptionsInSOMCluster = stmt.executeQuery(redescriptionsInSOMClusterString);
                while(redescriptionsInSOMCluster.next())
                {
                    temp.put("id", redescriptionsInSOMCluster.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[5];
                    tmpArr[0]=redescriptionsInSOMCluster.getString("redescriptionLR");
                    tmpArr[1]=redescriptionsInSOMCluster.getString("redescriptionRR");
                    tmpArr[2]=redescriptionsInSOMCluster.getDouble("redescriptionJS");
                    tmpArr[3]=redescriptionsInSOMCluster.getInt("redescriptionSupport");
                    tmpArr[4]=redescriptionsInSOMCluster.getInt("redescriptionPval");
                    temp.put("data", tmpArr);
                    redescriptions.add(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptions", redescriptions);

                String elementsInSOMClusterString = "SELECT elementID, elementDescription "+
                        "FROM ElementTable WHERE "+
                        "elementID IN "+
                        "(SELECT elementID "+
                        "FROM SOMClusters "+
                        "WHERE SOMClusterID ="+id+" AND userId = "+userId+")";
                ResultSet elementsInSOMCluster = stmt.executeQuery(elementsInSOMClusterString);
                while(elementsInSOMCluster.next())
                {
                    temp.put("id", elementsInSOMCluster.getInt(1));
                    temp.put("name", elementsInSOMCluster.getString(2));
                    somElements.add(temp);
                    temp = new JSONObject();
                }
                res.put("somElements", somElements);

                String attributeDescriptionsInSOMClusterString = ""+
                        "SELECT ra.attributeID, count(ra.attributeID) as count, at.attributeDescription "+
                        "FROM attributeTable as at, RedescriptionAttributeTable as ra "+
                        "WHERE redescriptionID IN (SELECT redescriptionID FROM RedescriptionTable "+
                        "WHERE redescriptionID IN "+
                        "(SELECT distinct redescriptionID FROM RedescriptionElementTable "+
                        "WHERE elemetID IN (SELECT elementID FROM "+
                        "SOMClusters WHERE SOMClusterID = "+id+" AND userId = "+userId+") AND redescriptionID IN " +
                        "(SELECT redescriptionID FROM SelectedRedescriptionsElem WHERE userId = "+userId+")))"+
                        "AND ra.attributeID = at.attributeID GROUP BY ra.attributeID";
                ResultSet attributeDescriptionsInSOMCluster = stmt.executeQuery(attributeDescriptionsInSOMClusterString);
                while(attributeDescriptionsInSOMCluster.next())
                {
                    temp.put("id", attributeDescriptionsInSOMCluster.getInt("attributeID"));
                    Object[] tmpArr1 = new Object[2];
                    tmpArr1[0]=attributeDescriptionsInSOMCluster.getInt("count");
                    tmpArr1[1]=attributeDescriptionsInSOMCluster.getString("attributeDescription");
                    temp.put("data", tmpArr1);
                    attributeDescriptions.add(temp);
                    temp = new JSONObject();
                }
                res.put("attributeDescriptions", attributeDescriptions);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redescriptionsBack(Map<String, String> request, DataBaseEnum database) {
        int id;
        if(request.get("id")==null)
            id = 1;
        else
            id=Integer.parseInt(request.get("id"));

        JSONObject res = new JSONObject();
        JSONArray redescriptions = new JSONArray();
        JSONArray somElements = new JSONArray();
        JSONArray attributeDescriptions = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String redescriptionsInSOMClusterString = "SELECT * FROM RedescriptionTable as rt "+
                        "WHERE rt.redescriptionID IN "+
                        "(SELECT distinct redescriptionID FROM RedescriptionElementTable "+
                        "WHERE elemetID IN (SELECT elementID FROM "+
                        "SOMClustersBack WHERE SOMClusterID = "+id+
                        ") AND redescriptionID IN " +
                        "(SELECT redescriptionID FROM SelectedRedescriptionsElemBack))";
                ResultSet redescriptionsInSOMCluster = stmt.executeQuery(redescriptionsInSOMClusterString);
                while(redescriptionsInSOMCluster.next())
                {
                    temp.put("id", redescriptionsInSOMCluster.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[5];
                    tmpArr[0]=redescriptionsInSOMCluster.getString("redescriptionLR");
                    tmpArr[1]=redescriptionsInSOMCluster.getString("redescriptionRR");
                    tmpArr[2]=redescriptionsInSOMCluster.getDouble("redescriptionJS");
                    tmpArr[3]=redescriptionsInSOMCluster.getInt("redescriptionSupport");
                    tmpArr[4]=redescriptionsInSOMCluster.getInt("redescriptionPval");
                    temp.put("data", tmpArr);
                    redescriptions.add(temp);
                    //System.out.println(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptions", redescriptions);

                String elementsInSOMClusterString = "SELECT elementID, elementDescription "+
                        "FROM ElementTable WHERE "+
                        "elementID IN "+
                        "(SELECT elementID "+
                        "FROM SOMClustersBack "+
                        "WHERE SOMClusterID ="+id+")";
                ResultSet elementsInSOMCluster = stmt.executeQuery(elementsInSOMClusterString);
                while(elementsInSOMCluster.next())
                {
                    temp.put("id", elementsInSOMCluster.getInt(1));
                    temp.put("name", elementsInSOMCluster.getString(2));
                    somElements.add(temp);
                    temp = new JSONObject();
                }
                res.put("somElements", somElements);

                String attributeDescriptionsInSOMClusterString = ""+
                        "SELECT ra.attributeID, count(ra.attributeID) as count, at.attributeDescription "+
                        "FROM AttributeTable as at, RedescriptionAttributeTable as ra "+
                        "WHERE redescriptionID IN (SELECT redescriptionID FROM RedescriptionTable "+
                        "WHERE redescriptionID IN "+
                        "(SELECT distinct redescriptionID FROM RedescriptionElementTable "+
                        "WHERE elemetID IN (SELECT elementID FROM "+
                        "SOMClustersBack WHERE SOMClusterID = "+id+") AND redescriptionID IN " +
                        "(SELECT redescriptionID FROM SelectedRedescriptionsElemBack)))"+
                        "AND ra.attributeID = at.attributeID GROUP BY ra.attributeID";
                ResultSet attributeDescriptionsInSOMCluster = stmt.executeQuery(attributeDescriptionsInSOMClusterString);
                while(attributeDescriptionsInSOMCluster.next())
                {
                    temp.put("id", attributeDescriptionsInSOMCluster.getInt("attributeID"));
                    Object[] tmpArr1 = new Object[2];
                    tmpArr1[0]=attributeDescriptionsInSOMCluster.getInt("count");
                    tmpArr1[1]=attributeDescriptionsInSOMCluster.getString("attributeDescription");
                    temp.put("data", tmpArr1);
                    attributeDescriptions.add(temp);
                    temp = new JSONObject();
                }
                res.put("attributeDescriptions", attributeDescriptions);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject clusterinfo(Map<String,String> request, DataBaseEnum database) {
        int userId;
        userId=Integer.parseInt(request.get("userId"));

        JSONObject res = new JSONObject();
        JSONArray SOMDim = new JSONArray();
        JSONArray SOMInfo = new JSONArray();
        JSONArray rowsStatisticsSOM = new JSONArray();
        JSONArray rowsStatisticsSupp = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String SOMClusterInfoString = "Select SOMClusterID, count(distinct coverage.elementID) as clustSize, sum(redescriptionCount) as clustFrequency "+
                        "FROM ElementCoverage as coverage, SOMClusters as sc "+
                        "WHERE coverage.elementID = sc.elementID AND coverage.userId = sc.userId AND sc.userId = "+userId+" "+
                        "GROUP BY sc.SOMClusterID";
                ResultSet SOMClusterInfo = stmt.executeQuery(SOMClusterInfoString);
                while(SOMClusterInfo.next())
                {
                    int[] tmpArr = new int[2];
                    tmpArr[0]=SOMClusterInfo.getInt("clustSize");
                    tmpArr[1]=SOMClusterInfo.getInt("clustFrequency");
                    temp.put("id", SOMClusterInfo.getInt("SOMClusterID"));
                    temp.put("data", tmpArr);
                    SOMInfo.add(temp);
                    temp = new JSONObject();
                }
                res.put("SOMInfo", SOMInfo);

                String StatisticsSOMString = "SELECT SOMClusterID, redescriptionID, count(elemetID) as clEl from RedescriptionElementTable, SOMClusters WHERE "+
                        "elemetID IN (SELECT elemetID FROM RedescriptionElementTable as r WHERE r.redescriptionID=redescriptionID) AND elementID=elemetID "+
                        "AND userId = "+userId+" "+"GROUP By SOMClusterID, redescriptionID";
                ResultSet StatisticsSOM = stmt.executeQuery(StatisticsSOMString);
                while(StatisticsSOM.next())
                {
                    temp.put("clusterID", StatisticsSOM.getInt("SOMClusterID"));
                    int[] tmpArr1 = new int[2];
                    tmpArr1[0]=StatisticsSOM.getInt("redescriptionID");
                    tmpArr1[1]=StatisticsSOM.getInt("clEl");
                    temp.put("data", tmpArr1);
                    rowsStatisticsSOM.add(temp);
                    temp = new JSONObject();
                }
                res.put("StatisticsSOM", rowsStatisticsSOM);

                String StatisticsSuppString = "SELECT redescriptionID, count(elemetID) as suppEl from RedescriptionElementTable GROUP BY redescriptionID";
                ResultSet StatisticsSupp = stmt.executeQuery(StatisticsSuppString);
                while(StatisticsSupp.next())
                {
                    temp.put("redescriptionID", StatisticsSupp.getInt("redescriptionID"));
                    temp.put("suppElCount", StatisticsSupp.getInt("suppEl"));
                    rowsStatisticsSupp.add(temp);
                    temp = new JSONObject();
                }
                res.put("StatisticsSupp", rowsStatisticsSupp);

                String SOMDimensionsString = "SELECT NumRows, NumColumns FROM SOMDimensions WHERE userId = "+userId;
                ResultSet SOMDimensions = stmt.executeQuery(SOMDimensionsString);
                while(SOMDimensions.next())
                {
                    temp.put("nRows", SOMDimensions.getInt("NumRows"));
                    temp.put("nColumns", SOMDimensions.getInt("NumColumns"));
                    SOMDim.add(temp);
                    temp = new JSONObject();
                }
                res.put("SOMDim", SOMDim);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject clusterinfosel(Map<String, String> request, DataBaseEnum database) {
        int userId;
        userId=Integer.parseInt(request.get("userId"));

        JSONObject res = new JSONObject();
        JSONArray SOMDim = new JSONArray();
        JSONArray SOMInfo = new JSONArray();
        JSONArray rowsStatisticsSOM = new JSONArray();
        JSONArray rowsStatisticsSupp = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String SOMClusterInfoString = "Select SOMClusterID, count(distinct coverage.elementID) as clustSize, sum(redescriptionCount) as clustFrequency "+
                        "FROM ElementCoverage as coverage, SOMClusters as sc "+
                        "WHERE coverage.elementID = sc.elementID AND coverage.userId = sc.userId AND coverage.userId = "+userId+" "+
                        "GROUP BY sc.SOMClusterID";
                ResultSet SOMClusterInfo = stmt.executeQuery(SOMClusterInfoString);
                while(SOMClusterInfo.next())
                {
                    int[] tmpArr = new int[2];
                    tmpArr[0]=SOMClusterInfo.getInt("clustSize");
                    tmpArr[1]=SOMClusterInfo.getInt("clustFrequency");
                    temp.put("id", SOMClusterInfo.getInt("SOMClusterID"));
                    temp.put("data", tmpArr);
                    SOMInfo.add(temp);
                    temp = new JSONObject();
                }
                res.put("SOMInfo", SOMInfo);

                String StatisticsSOMString = "SELECT SOMClusterID, redescriptionID, count(distinct elemetID) as clEl from RedescriptionElementTable, SOMClusters WHERE "+
                        "userId = "+userId+" "+"AND redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElem WHERE userId = "+userId+") AND elementID=elemetID "+
                        "GROUP By SOMClusterID, redescriptionID";
                ResultSet StatisticsSOM = stmt.executeQuery(StatisticsSOMString);
                while(StatisticsSOM.next())
                {
                    temp.put("clusterID", StatisticsSOM.getInt("SOMClusterID"));
                    int[] tmpArr1 = new int[2];
                    tmpArr1[0]=StatisticsSOM.getInt("redescriptionID");
                    tmpArr1[1]=StatisticsSOM.getInt("clEl");
                    temp.put("data", tmpArr1);
                    rowsStatisticsSOM.add(temp);
                    temp = new JSONObject();
                }
                res.put("StatisticsSOM", rowsStatisticsSOM);

                String StatisticsSuppString = "SELECT redescriptionID, count(elemetID) as suppEl from RedescriptionElementTable WHERE redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElem where userId = "+userId+
                        ")  GROUP BY redescriptionID";
                ResultSet StatisticsSupp = stmt.executeQuery(StatisticsSuppString);
                while(StatisticsSupp.next())
                {
                    temp.put("redescriptionID", StatisticsSupp.getInt("redescriptionID"));
                    temp.put("suppElCount", StatisticsSupp.getInt("suppEl"));
                    rowsStatisticsSupp.add(temp);
                    temp = new JSONObject();
                }
                res.put("StatisticsSupp", rowsStatisticsSupp);

                String SOMDimensionsString = "SELECT NumRows, NumColumns FROM SOMDimensions WHERE userId = "+userId;
                ResultSet SOMDimensions = stmt.executeQuery(SOMDimensionsString);
                while(SOMDimensions.next())
                {
                    temp.put("nRows", SOMDimensions.getInt("NumRows"));
                    temp.put("nColumns", SOMDimensions.getInt("NumColumns"));
                    SOMDim.add(temp);
                    temp = new JSONObject();
                }
                res.put("SOMDim", SOMDim);

            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject clusterinfoBack(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        JSONArray SOMDim = new JSONArray();
        JSONArray SOMInfo = new JSONArray();
        JSONArray rowsStatisticsSOM = new JSONArray();
        JSONArray rowsStatisticsSupp = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String SOMClusterInfoString = "Select SOMClusterID, count(coverage.elementID) as clustSize, sum(redescriptionCount) as clustFrequency "+
                        "FROM ElementCoverageBack as coverage, SOMClustersBack as sc "+
                        "WHERE coverage.elementID = sc.elementID "+
                        "GROUP BY sc.SOMClusterID";
                ResultSet SOMClusterInfo = stmt.executeQuery(SOMClusterInfoString);
                while(SOMClusterInfo.next())
                {
                    int[] tmpArr = new int[2];
                    tmpArr[0]=SOMClusterInfo.getInt("clustSize");
                    tmpArr[1]=SOMClusterInfo.getInt("clustFrequency");
                    temp.put("id", SOMClusterInfo.getInt("SOMClusterID"));
                    temp.put("data", tmpArr);
                    SOMInfo.add(temp);
                    temp = new JSONObject();
                }
                res.put("SOMInfo", SOMInfo);

                String StatisticsSOMString = "SELECT SOMClusterID, redescriptionID, count(elemetID) as clEl from RedescriptionElementTable, SOMClustersBack WHERE "+
                        "redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElemBack) AND elementID=elemetID "+
                        "GROUP By SOMClusterID, redescriptionID";
                ResultSet StatisticsSOM = stmt.executeQuery(StatisticsSOMString);
                while(StatisticsSOM.next())
                {
                    temp.put("clusterID", StatisticsSOM.getInt("SOMClusterID"));
                    int[] tmpArr1 = new int[2];
                    tmpArr1[0]=StatisticsSOM.getInt("redescriptionID");
                    tmpArr1[1]=StatisticsSOM.getInt("clEl");
                    temp.put("data", tmpArr1);
                    rowsStatisticsSOM.add(temp);
                    temp = new JSONObject();
                }
                res.put("StatisticsSOM", rowsStatisticsSOM);

                String StatisticsSuppString = "SELECT redescriptionID, count(elemetID) as suppEl from RedescriptionElementTable where redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElemBack) GROUP BY redescriptionID";
                ResultSet StatisticsSupp = stmt.executeQuery(StatisticsSuppString);
                while(StatisticsSupp.next())
                {
                    temp.put("redescriptionID", StatisticsSupp.getInt("redescriptionID"));
                    temp.put("suppElCount", StatisticsSupp.getInt("suppEl"));
                    rowsStatisticsSupp.add(temp);
                    temp = new JSONObject();
                }
                res.put("StatisticsSupp", rowsStatisticsSupp);

                String SOMDimensionsString = "SELECT * FROM SOMDimensionsBack";
                ResultSet SOMDimensions = stmt.executeQuery(SOMDimensionsString);
                while(SOMDimensions.next())
                {
                    temp.put("nRows", SOMDimensions.getInt("NumRows"));
                    temp.put("nColumns", SOMDimensions.getInt("NumColumns"));
                    SOMDim.add(temp);
                    temp = new JSONObject();
                }
                res.put("SOMDim", SOMDim);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redescriptionInfo(Map<String, String> request, DataBaseEnum database) {
        int id;
        if(request.get("id")==null) id = 0;
        else id=Integer.parseInt(request.get("id"));

        JSONObject res = new JSONObject();
        JSONArray AttributeIntervals = new JSONArray();
        JSONArray RedAttributes = new JSONArray();
        JSONArray AttrDesc = new JSONArray();
        JSONArray CategoryDesc = new JSONArray();
        JSONArray ElemDesc = new JSONArray();
        JSONArray RedSupportArr = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String RedAttributeElemValuesAllString = "SELECT elementID, attributeID, Elementvalue FROM DataTable "+
                        "WHERE attributeID IN (select attributeID from RedescriptionAttributeTable "+
                        "WHERE redescriptionID="+id+")";
                ResultSet RedAttributeElemValuesAll = stmt.executeQuery(RedAttributeElemValuesAllString);
                while(RedAttributeElemValuesAll.next())
                {
                    Object[] tmpArr = new Object[2];
                    tmpArr[0]=RedAttributeElemValuesAll.getInt("elementID");
                    tmpArr[1]=RedAttributeElemValuesAll.getDouble("elementValue");
                    temp.put("id", RedAttributeElemValuesAll.getInt("attributeID"));
                    temp.put("data", tmpArr);
                    RedAttributes.add(temp);
                    temp = new JSONObject();
                }
                res.put("RedAttributes", RedAttributes);

                String RedAttributeIntervalsString = "SELECT clauseID, attributeID, attributeMinValue, attributeMaxValue, negated FROM RedescriptionAttributeTable "+
                        "WHERE redescriptionID = "+id;
                ResultSet RedAttributeIntervals = stmt.executeQuery(RedAttributeIntervalsString);
                Integer count = 0;
                while(RedAttributeIntervals.next())
                {
                    Object[] tmpArr1 = new Object[5];
                    tmpArr1[0]=RedAttributeIntervals.getInt("attributeID");
                    tmpArr1[1]=RedAttributeIntervals.getInt("attributeMinValue");
                    tmpArr1[2]=RedAttributeIntervals.getDouble("attributeMaxValue");
                    tmpArr1[3]=RedAttributeIntervals.getDouble("negated");
                    tmpArr1[4]=RedAttributeIntervals.getInt("clauseID");
                    temp.put("id", count);
                    temp.put("data", tmpArr1);
                    AttributeIntervals.add(temp);
                    count = count+1;
                    temp = new JSONObject();
                }
                res.put("AttributeIntervals", AttributeIntervals);

                String RedSupportString = "SELECT elemetID as element FROM RedescriptionElementTable "+
                        "WHERE redescriptionID = "+id;
                ResultSet RedSupport = stmt.executeQuery(RedSupportString);
                while(RedSupport.next())
                {
                    temp.put("element", RedSupport.getInt("element"));
                    RedSupportArr.add(temp);
                    temp = new JSONObject();
                }
                res.put("RedSupport", RedSupportArr);

                String RedSupportDescriptionString = "SELECT elementDescription FROM ElementTable "+
                        "WHERE elementID IN( "+
                        "SELECT elemetID as element FROM RedescriptionElementTable "+
                        "WHERE redescriptionID = "+id+")";
                ResultSet RedSupportDescription = stmt.executeQuery(RedSupportDescriptionString);
                while(RedSupportDescription.next())
                {
                    temp.put("elementDescription", RedSupportDescription.getString("elementDescription"));
                    ElemDesc.add(temp);
                    temp = new JSONObject();
                }
                res.put("ElemDesc", ElemDesc);

                String CategoryString = "SELECT * FROM CategoryTable "+
                        "WHERE attributeID IN (SELECT attributeID FROM RedescriptionAttributeTable "+
                        "WHERE redescriptionID = "+id+")";
                ResultSet Category = stmt.executeQuery(CategoryString);
                while(Category.next())
                {
                    Object[] tmpArr1 = new Object[3];
                    tmpArr1[0]=Category.getInt("attributeID");
                    tmpArr1[1]=Category.getDouble("categoryValue");
                    tmpArr1[2]=Category.getString("categoryName");
                    temp.put("data", tmpArr1);
                    CategoryDesc.add(temp);
                    temp = new JSONObject();
                }
                res.put("CategoryDesc", CategoryDesc);

                String AttrDesString = "SELECT * FROM AttributeTable "+
                        "WHERE attributeID IN (SELECT attributeID FROM RedescriptionAttributeTable "+
                        "WHERE redescriptionID = "+id+")";
                ResultSet AttrDes = stmt.executeQuery(AttrDesString);
                while(AttrDes.next())
                {
                    temp.put("id", AttrDes.getInt("attributeID"));
                    Object[] tmpArr1 = new Object[3];
                    tmpArr1[0]=AttrDes.getString("attributeName");
                    tmpArr1[1]=AttrDes.getString("attributeDescription");
                    tmpArr1[2]=AttrDes.getInt("view");
                    temp.put("data", tmpArr1);
                    AttrDesc.add(temp);
                    temp = new JSONObject();
                }
                res.put("AttrDesc", AttrDesc);

            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject redescriptionSupport(Map<String, String> request, DataBaseEnum database) {
        int id;
        if(request.get("id")==null) id = 0;
        else id=Integer.parseInt(request.get("id"));
        JSONObject res = new JSONObject();
        try{
            //System.out.println(request);
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray rowsRedSupp = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT elemetID FROM RedescriptionElementTable " +
                        "WHERE redescriptionID = "+id);
                while(rs.next())
                {
                    //res.put("rowsRedSupp", rs.getInt("elemetID"));
                    temp.put("elemetID", rs.getInt("elemetID"));
                    rowsRedSupp.add(temp);
                    temp = new JSONObject();
                }
                res.put("rowsRedSupp", rowsRedSupp);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject allRedescriptions(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String RedMeasuresString = "PRAGMA table_info(RedescriptionTable)";
                Statement st = conn.createStatement();

                String MeasureNamesString = "SELECT displayName, shortName from MeasuresNames";

                Integer length = 0;

                JSONObject temp = new JSONObject();
                JSONArray measures = new JSONArray();
                ResultSet RedMeasures = st.executeQuery(RedMeasuresString);
                while(RedMeasures.next()){
                    length++;
                    temp.put("cid", RedMeasures.getInt("cid"));
                    temp.put("name", RedMeasures.getString("name"));
                    temp.put("type", RedMeasures.getString("type"));
                    temp.put("notnull", RedMeasures.getInt("notnull"));
                    temp.put("dflt_value", RedMeasures.getString("dflt_value"));
                    temp.put("pk", RedMeasures.getInt("pk"));
                    measures.add(temp);
                    temp = new JSONObject();
                }

                RedMeasures = st.executeQuery(RedMeasuresString);
                Integer i = 0;
                String RedMinMaxString = "SELECT ";

                while(RedMeasures.next()){
                    if(i>2) {
                        if(i+1<length)
                            RedMinMaxString = RedMinMaxString + "max("+RedMeasures.getString("name")+
                                    ") as maxMeasure"+(i-2)+", "+"min("+RedMeasures.getString("name")+") as minMeasure"+(i-2)+", ";
                        else
                            RedMinMaxString = RedMinMaxString + "max("+RedMeasures.getString("name")+
                                    ") as maxMeasure"+(i-2)+", "+"min("+RedMeasures.getString("name")+") as minMeasure"+(i-2)+" FROM RedescriptionTable";

                    }
                    i++;
                }
                i = 0;
                RedMeasures = st.executeQuery(RedMeasuresString);
                String redNamesRenamedString = "SELECT ";
                while(RedMeasures.next()){
                    if(i==0)
                        redNamesRenamedString = redNamesRenamedString + RedMeasures.getString("name") +" as id"+", ";
                    else if(i+1<length)
                        redNamesRenamedString = redNamesRenamedString + RedMeasures.getString("name") +" as col"+i+", ";
                    else
                        redNamesRenamedString = redNamesRenamedString + RedMeasures.getString("name") +" as col"+i;

                    i++;
                }
                redNamesRenamedString = redNamesRenamedString + " FROM RedescriptionTable";


                ResultSet redNamesRenamed = stmt.executeQuery(redNamesRenamedString);
                JSONArray redescriptions = new JSONArray();
                while(redNamesRenamed.next()){
                    temp.put("id", redNamesRenamed.getInt("id"));
                    for(i=1; i<length; i++) {
                        if(i<3)
                            temp.put("col" + i, redNamesRenamed.getString("col" + i));
                        else
                            temp.put("col" + i, redNamesRenamed.getDouble("col" + i));
                    }
                    redescriptions.add(temp);
                    temp = new JSONObject();
                }
                JSONArray minMax = new JSONArray();

                ResultSet RedMinMax = stmt.executeQuery(RedMinMaxString);
                while(RedMinMax.next()){
                    for(i=1; i<length-2; i++) {
                        temp.put("maxMeasure" + i, RedMinMax.getDouble("maxMeasure" + i));
                        temp.put("minMeasure" + i, RedMinMax.getDouble("minMeasure" + i));
                    }
                    minMax.add(temp);
                    temp = new JSONObject();
                }

                ResultSet MeasureNames = stmt.executeQuery(MeasureNamesString);
                JSONArray measureNames = new JSONArray();
                while(MeasureNames.next()){
                    temp.put("displayName", MeasureNames.getString("displayName"));
                    temp.put("shortName", MeasureNames.getString("shortName"));
                    measureNames.add(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptions", redescriptions);
                res.put("measures", measures);
                res.put("minMax", minMax);
                res.put("measureNames", measureNames);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return res;
    }

    public Object graphData(JSONObject request, DataBaseEnum database){
        //2 run 1 prepare (somData)
        JSONParser jsonParser = new JSONParser();
        JSONArray graph = new JSONArray();
        try {
            graph = (JSONArray) jsonParser.parse(String.valueOf(request.get("graph")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);
                stmt.execute("DROP TABLE IF EXISTS GraphTable");
                stmt.execute("CREATE TABLE IF NOT EXISTS GraphTable (redId1 Integer, redId2 Integer, overlap Float)");

                Iterator<JSONArray> iterator = graph.iterator();
                Integer i = 0, j = 0;
                while(iterator.hasNext()){
                    JSONArray data = iterator.next();
                    Iterator<Float> iterator1 = data.iterator();
                    while(iterator1.hasNext()){
                        Float dataij = iterator1.next();
                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                        insertPstmt.setInt(1, i);
                        insertPstmt.setInt(2, j);
                        insertPstmt.setFloat(3, dataij);
                        insertPstmt.executeUpdate();
                        j++;
                    }
                    i++;
                }

                conn.commit();
            }

            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public Object graphDataG(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONArray graph = new JSONArray();
        Integer startIndex = null;
        try {
            graph = (JSONArray) jsonParser.parse(String.valueOf(request.get("graph")));
            startIndex = (Integer)jsonParser.parse(String.valueOf(request.get("start")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);
                stmt.execute("CREATE TABLE IF NOT EXISTS GraphTable (redId1 Integer, redId2 Integer, overlap Float)");

                //System.out.println("start Index: "+startIndex);
                Iterator<JSONArray> iterator = graph.iterator();
                Integer i = 0, j = 0;
                while(iterator.hasNext()){
                    JSONArray data = iterator.next();
                    Iterator<Float> iterator1 = data.iterator();
                    while(iterator1.hasNext()){
                        Float dataij = iterator1.next();
                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                        insertPstmt.setInt(1, i+startIndex);
                        insertPstmt.setInt(2, j);
                        insertPstmt.setFloat(3, dataij);
                        insertPstmt.executeUpdate();
                        j++;
                    }
                    i++;
                }

                conn.commit();

            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        System.out.println("responce sent");
        return null;
    }

    public Object graphDataAttr(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONArray graph = new JSONArray();
        try {
            graph = (JSONArray) jsonParser.parse(String.valueOf(request.get("graphAttr")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);
                stmt.execute("DROP TABLE IF EXISTS GraphTableAttr");
                stmt.execute("CREATE TABLE IF NOT EXISTS GraphTableAttr (redId1 Integer, redId2 Integer, overlap Float)");

                Iterator<JSONArray> iterator = graph.iterator();
                Integer i = 0, j = 0;
                while(iterator.hasNext()){
                    JSONArray data = iterator.next();
                    Iterator<Float> iterator1 = data.iterator();
                    while(iterator1.hasNext()){
                        Float dataij = iterator1.next();
                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                        insertPstmt.setInt(1, i);
                        insertPstmt.setInt(2, j);
                        insertPstmt.setFloat(3, dataij);
                        insertPstmt.executeUpdate();
                        j++;
                    }
                    i++;
                }

                conn.commit();
            }

            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public Object graphDataAttrG(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        JSONArray graph = new JSONArray();
        Integer startIndex = null;
        try {
            graph = (JSONArray) jsonParser.parse(String.valueOf(request.get("graphAttr")));
            startIndex = (Integer)jsonParser.parse(String.valueOf(request.get("start")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);
                stmt.execute("CREATE TABLE IF NOT EXISTS GraphTableAttr (redId1 Integer, redId2 Integer, overlap Float)");

                Iterator<JSONArray> iterator = graph.iterator();
                Integer i = 0, j = 0;
                while(iterator.hasNext()){
                    JSONArray data = iterator.next();
                    Iterator<Float> iterator1 = data.iterator();
                    while(iterator1.hasNext()){
                        Float dataij = iterator1.next();
                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                        insertPstmt.setInt(1, i+startIndex);
                        insertPstmt.setInt(2, j);
                        insertPstmt.setFloat(3, dataij);
                        insertPstmt.executeUpdate();
                        j++;
                    }
                    i++;
                }
                conn.commit();
            }

            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public JSONObject numReds(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray numReds = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT count(*) as numReds FROM RedescriptionTable");
                while(rs.next())
                {
                    //res.put("numReds", rs.getInt("numReds"));
                    temp.put("numReds", rs.getInt("numReds"));
                    numReds.add(temp);
                    temp = new JSONObject();
                }
                res.put("numReds", numReds);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject graphDataGet(Map<String, String> request, DataBaseEnum database) {
        int startIndex, endIndex, numReds;
        JSONObject res = new JSONObject();
        if(request.get("start")==null || request.get("end")==null || request.get("nr")==null){
            return res;
        }
        else {
            startIndex = Integer.parseInt(request.get("start"));
            endIndex = Integer.parseInt(request.get("end"));
            numReds = Integer.parseInt(request.get("nr"));
        }
        if(numReds == 0 || startIndex > endIndex ){
            return res;
        }
        //System.out.println(startIndex+" "+endIndex);
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                String getGraph = "SELECT * from GraphTable where redId1>="+startIndex+" AND redId1<"+endIndex;

                ResultSet rowsGraph = stmt.executeQuery(getGraph);
                Object[][] tmpArr1 = new Object[endIndex-startIndex][numReds];
                while(rowsGraph.next())
                {
                    tmpArr1[rowsGraph.getInt("redId1")-startIndex][rowsGraph.getInt("redId2")] = rowsGraph.getFloat("overlap");
                }
                res.put("GraphData", tmpArr1);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject graphDataAttrGet(Map<String, String> request, DataBaseEnum database) {
        int startIndex, endIndex, numReds;
        JSONObject res = new JSONObject();
        if(request.get("start")==null || request.get("end")==null || request.get("nr")==null){
            return res;
        }
        else {
            startIndex = Integer.parseInt(request.get("start"));
            endIndex = Integer.parseInt(request.get("end"));
            numReds = Integer.parseInt(request.get("nr"));
        }
        if(numReds == 0 || startIndex > endIndex ){
            return res;
        }
        //System.out.println(startIndex+" "+endIndex);
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                String getGraphAttr = "SELECT * from GraphTable where redId1>="+startIndex+" AND redId1<"+endIndex;

                ResultSet rowsGraph = stmt.executeQuery(getGraphAttr);
                Object[][] tmpArr1 = new Object[endIndex-startIndex][numReds];
                while(rowsGraph.next())
                {
                    tmpArr1[rowsGraph.getInt("redId1")-startIndex][rowsGraph.getInt("redId2")] = rowsGraph.getFloat("overlap");
                }
                res.put("GraphDataAttr", tmpArr1);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
        return res;
    }

    public Object attrFreq(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        Long userId = null;
        JSONArray attributeFrequency = new JSONArray();
        JSONArray attCooc = new JSONArray();
        JSONArray selReds = new JSONArray();
        try {
            userId = (Long) jsonParser.parse(String.valueOf(request.get("userId")));
            attributeFrequency = (JSONArray) jsonParser.parse(String.valueOf(request.get("attributeFrequency")));
            attCooc = (JSONArray) jsonParser.parse(String.valueOf(request.get("attCooc")));
            selReds = (JSONArray) jsonParser.parse(String.valueOf(request.get("selReds")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
            System.out.println("userId: " + userId + "\natributeFrequency: " + attributeFrequency + "\nselReds: " + selReds);
            try {
                Connection conn = connect(database.databaseName);
                Statement stmt = conn.createStatement();

                if (conn != null) {
                    conn.setAutoCommit(false);
                    //if(!attributeFrequency.isEmpty()) {
                        stmt.execute("DELETE FROM AttributeFrequencyTable where userId = " + userId);
                        stmt.execute("DELETE FROM AttributeCoocurenceTable where userId = " + userId);
                    //}
                    //if(!selReds.isEmpty())
                        stmt.execute("DELETE FROM SelectedRedescriptionsAttr where userId = " + userId);

                    Iterator<JSONObject> iterator = attributeFrequency.iterator();
                    while (iterator.hasNext()) {
                        JSONObject freq = iterator.next();
                        Long frequency = null;
                        Long id = null;
                        String name = "";
                        try {
                            frequency = (Long) jsonParser.parse(String.valueOf(freq.get("frequency")));
                            id = (Long) jsonParser.parse(String.valueOf(freq.get("id")));
                            name = (String) freq.get("name");
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }

                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO AttributeFrequencyTable VALUES (?,?,?,?)");
                        insertPstmt.setLong(1, userId);
                        insertPstmt.setLong(2, frequency);
                        insertPstmt.setLong(3, id);
                        insertPstmt.setString(4, name);
                        insertPstmt.executeUpdate();
                    }

                    Iterator<JSONObject> iterator2 = attCooc.iterator();
                    while (iterator2.hasNext()) {
                        JSONObject ac = iterator2.next();
                        Long cooc = null;
                        Long id1 = null;
                        Long id2 = null;
                        try {
                            cooc = (Long) jsonParser.parse(String.valueOf(ac.get("cooc")));
                            id1 = (Long) jsonParser.parse(String.valueOf(ac.get("id1")));
                            id2 = (Long) jsonParser.parse(String.valueOf(ac.get("id2")));
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }

                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO AttributeCoocurenceTable VALUES (?,?,?,?)");
                        insertPstmt.setLong(1, userId);
                        insertPstmt.setLong(2, cooc);
                        insertPstmt.setLong(3, id1);
                        insertPstmt.setLong(4, id2);
                        insertPstmt.executeUpdate();
                    }

                    //PROVJERI! tu mozda iterator<long>...nakon heatmap on selection
                    Iterator<Long> iterator3 = selReds.iterator();
                    while (iterator3.hasNext()) {
                        Long sr = iterator3.next();
                        PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO SelectedRedescriptionsAttr VALUES (?,?)");
                        insertPstmt.setLong(1, userId);
                        insertPstmt.setLong(2, sr);
                        insertPstmt.executeUpdate();
                    }

                    conn.commit();
                }

                conn.close();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }

        return null;
    }

    public Object sharedData(JSONObject request, DataBaseEnum database){
        JSONParser jsonParser = new JSONParser();
        Long userId = null;
        JSONArray sharedData = new JSONArray();
        try {
            userId = (Long) jsonParser.parse(String.valueOf(request.get("userId")));
            sharedData = (JSONArray) jsonParser.parse(String.valueOf(request.get("sharedData")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        System.out.println("shared data: " + sharedData);
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {
                conn.setAutoCommit(false);
                stmt.execute("DELETE FROM SelectedRedescriptions where userId = "+userId);

                Iterator<Long> iterator = sharedData.iterator();
                while(iterator.hasNext()){
                    Long sd = iterator.next();
                    PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO SelectedRedescriptions VALUES (?,?)");
                    insertPstmt.setLong(1, userId);
                    insertPstmt.setLong(2, sd);
                    insertPstmt.executeUpdate();
                }

                conn.commit();
            }

            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        return null;
    }

    public JSONObject sharedDataGet(Map<String, String> request, DataBaseEnum database) {
        int userId;
        userId=Integer.parseInt(request.get("userId"));
        JSONObject res = new JSONObject();
        try{
            //System.out.println(request);
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray data = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("Select redescriptionID as id from SelectedRedescriptions " +
                        "where userId = "+userId);
                while(rs.next())
                {
                    
                    //res.put("data", rs.getInt("id"));
                    temp.put("id", rs.getInt("id"));
                    data.add(temp);
                    temp = new JSONObject();
                }
                res.put("data", data);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject checkTable(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray count = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("Select count(*) as number from sqlite_master where type=\'table\' AND name=\'GraphTable\'");
                while(rs.next())
                {
                    
                    //res.put("count", rs.getInt("number"));
                    temp.put("number", rs.getInt("number"));
                    count.add(temp);
                    temp = new JSONObject();
                }
                res.put("count", count);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject checkTableAttrs(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray count = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("Select count(*) as number from sqlite_master where type=\'table\' AND name=\'GraphTableAttr\'");
                while(rs.next())
                {
                    
                    //res.put("count", rs.getInt("number"));
                    temp.put("number", rs.getInt("number"));
                    count.add(temp);
                }
                res.put("count", count);
                //temp = new JSONObject();
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject initatData(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray data = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT DISTINCT redescriptionID as redId, attributeID as atId from RedescriptionAttributeTable");
                while(rs.next())
                {
                    
                    temp.put("redId", rs.getInt("redId"));
                    temp.put("atId", rs.getInt("atId"));
                    data.add(temp);
                    temp = new JSONObject();
                }
                res.put("data", data);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject attributeData(DataBaseEnum database) {
        JSONObject res = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray attributes = new JSONArray();
            JSONArray frequency = new JSONArray();
            JSONArray attCooc = new JSONArray();

            if(conn != null) {

                ResultSet rs = stmt.executeQuery("SELECT attributeID as id, attributeName as Name FROM AttributeTable");
                while(rs.next())
                {
                    
                    temp.put("id", rs.getInt("id"));
                    temp.put("Name", rs.getString("Name"));
                    attributes.add(temp);
                    temp = new JSONObject();
                }
                res.put("attributes", attributes);

                ResultSet rs2 = stmt.executeQuery("SELECT attributeID as id, count(DISTINCT redescriptionID) as frequency FROM RedescriptionAttributeTable group by attributeID");
                while(rs2.next())
                {
                    //System.out.println(rs2);
                    temp.put("id", rs2.getInt("id"));
                    temp.put("frequency", rs2.getInt("frequency"));
                    frequency.add(temp);
                    temp = new JSONObject();
                }
                res.put("frequency", frequency);

                ResultSet rs3 = stmt.executeQuery("SELECT COUNT(distinct a1.redescriptionID) as cooc, a1.attributeID as id1, a2.attributeID as id2 FROM RedescriptionAttributeTable as a1, RedescriptionAttributeTable as a2 WHERE a1.redescriptionID=a2.redescriptionID group by a1.attributeID, a2.attributeID");
                while(rs3.next())
                {
                    //System.out.println(rs3);
                    temp.put("cooc", rs3.getInt("cooc"));
                    temp.put("id1", rs3.getInt("id1"));
                    temp.put("id2", rs3.getInt("id2"));
                    attCooc.add(temp);
                    temp = new JSONObject();
                }
                res.put("attCooc", attCooc);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res);
        return res;
    }

    public JSONObject attributeCoocurence(Map<String,String> request, DataBaseEnum database) {
        int toDisplay, offsetRow, offsetCol, userId;
        if(request.get("toDisplay") == null) toDisplay = 50;
        else toDisplay=Integer.parseInt(request.get("toDisplay"));

        if(request.get("offsetRow") == null) offsetRow = 50;
        else offsetRow=Integer.parseInt(request.get("offsetRow"));

        if(request.get("offsetCol") == null) offsetCol = 50;
        else offsetCol=Integer.parseInt(request.get("offsetCol"));

        if(request.get("userId") == null) userId = 50;
        else userId=Integer.parseInt(request.get("userId"));

        //System.out.println("\nuserId" + userId);
        JSONObject res = new JSONObject();
        try{
            //System.out.println(request);
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            JSONObject temp = new JSONObject();
            JSONArray rowsAttNodes = new JSONArray();
            JSONArray rowsAttNodes1 = new JSONArray();
            JSONArray rowsAttCount = new JSONArray();
            JSONArray rowsAttCountRow = new JSONArray();
            JSONArray rowsAttCountCol = new JSONArray();
            JSONArray rowsLinks = new JSONArray();
            JSONArray rowsMax = new JSONArray();
            int number = (offsetRow-1)*toDisplay;

            if(conn != null) {

                String attributeNodesString = "SELECT aft.frequency as count, aft.attributeID as id, at.attributeName as Name, at.attributeDescription as Description " +
                        "FROM AttributeFrequencyTable as aft INNER JOIN AttributeTable as at " +
                        "ON aft.attributeID=at.attributeID WHERE at.view=1 AND aft.userId="+userId+" "+
                        "ORDER BY aft.frequency desc LIMIT "+toDisplay+" OFFSET "+number+"";
                ResultSet attributeNodes = stmt.executeQuery(attributeNodesString);
                while(attributeNodes.next())
                {
                    temp.put("count", attributeNodes.getInt("count"));
                    temp.put("id", attributeNodes.getInt("id"));
                    temp.put("Name", attributeNodes.getString("Name"));
                    temp.put("Description", attributeNodes.getString("Description"));
                    rowsAttNodes.add(temp);
                    //System.out.println(rowsAttNodes);
                    temp = new JSONObject();
                }
                res.put("nodes1", rowsAttNodes);


                ResultSet attributeNodes1 = stmt.executeQuery("SELECT frequency as count, aft.attributeID as id, at.attributeName as Name, at.attributeDescription as Description " +
                        "FROM AttributeFrequencyTable as aft, AttributeTable as at " +
                        "WHERE aft.attributeID=at.attributeID AND at.view=2 AND userId = "+userId+" " +
                        "ORDER BY frequency desc LIMIT "+toDisplay+" OFFSET "+((offsetCol-1)*toDisplay));
                while(attributeNodes1.next())
                {
                    //System.out.println(attributeNodes1);
                    temp.put("count", attributeNodes1.getInt("count"));
                    temp.put("id", attributeNodes1.getInt("id"));
                    temp.put("Name", attributeNodes1.getString("Name"));
                    temp.put("Description", attributeNodes1.getString("Description"));
                    rowsAttNodes1.add(temp);
                    temp = new JSONObject();
                }
                res.put("nodes2", rowsAttNodes1);
                temp = new JSONObject();

                ResultSet attributeCount = stmt.executeQuery("SELECT count(attributeID) as count FROM AttributeTable");
                while(attributeCount.next())
                {
                    //System.out.println(attributeCount);
                    temp.put("count", attributeCount.getInt("count"));
                    rowsAttCount.add(temp);
                    temp = new JSONObject();
                }
                res.put("attcount", rowsAttCount);

                ResultSet attributeCountRow = stmt.executeQuery("SELECT count(attributeID) as count FROM AttributeTable WHERE view=1 AND attributeID IN " +
                        "(SELECT attributeID1 FROM AttributeCoocurenceTable WHERE userId = "+userId+")");
                while(attributeCountRow.next())
                {
                    temp.put("count", attributeCountRow.getInt("count"));
                    rowsAttCountRow.add(temp);
                    temp = new JSONObject();
                }
                res.put("attcountW1", rowsAttCountRow);

                ResultSet attributeCountCol = stmt.executeQuery("SELECT count(attributeID) as count FROM AttributeTable WHERE view=2 AND attributeID IN "+
                        "(SELECT attributeID2 FROM AttributeCoocurenceTable WHERE userId = "+userId+")");
                while(attributeCountCol.next())
                {
                    temp.put("count", attributeCountCol.getInt("count"));
                    rowsAttCountCol.add(temp);
                    temp = new JSONObject();
                }
                res.put("attcountW2", rowsAttCountCol);

                ResultSet links = stmt.executeQuery("SELECT attributeID1 as source, attributeID2 as target, coocurence as value "+
                        "FROM AttributeCoocurenceTable as act, AttributeTable as at1, AttributeTable as at2 "+
                        "WHERE attributeID1!=attributeID2 and attributeID1=at1.attributeID AND attributeID2=at2.attributeID "+
                        "AND at1.view=1 AND at2.view=2 AND act.userId = "+userId+" "+
                        "AND attributeID1 IN (SELECT at.attributeID from AttributeFrequencyTable as aft, AttributeTable as at "+
                        "WHERE aft.attributeID=at.attributeID AND at.view=1 AND aft.userId = "+userId+" "+"ORDER BY frequency DESC LIMIT "+toDisplay+" OFFSET "+(offsetRow-1)*toDisplay +") "+
                        "AND attributeID2 IN (SELECT at.attributeID from AttributeFrequencyTable as aft, attributeTable as at "+
                        "WHERE aft.attributeID=at.attributeID AND at.view=2 AND aft.userId = "+userId+" ORDER BY frequency DESC LIMIT "+toDisplay+" OFFSET "+(offsetCol-1)*toDisplay+") "+
                        "ORDER BY coocurence DESC");
                while(links.next())
                {
                    temp.put("source", links.getInt("source"));
                    temp.put("target", links.getInt("target"));
                    temp.put("value", links.getInt("value"));
                    rowsLinks.add(temp);
                    temp = new JSONObject();
                }
                res.put("links", rowsLinks);

                res.put("pageRows", offsetRow);
                res.put("pageCols", offsetCol);

                ResultSet maxCoocurence = stmt.executeQuery("SELECT max(coocurence) as maxCoocurence FROM AttributeCoocurenceTable, AttributeTable as at1, AttributeTable as at2 WHERE "+
                        "attributeID1!=attributeID2 AND at1.attributeID=attributeID1 AND at2.attributeID=attributeID2 AND at1.view=1 and at2.view=2 AND userId = "+userId);
                while(maxCoocurence.next())
                {
                    //System.out.println(maxCoocurence);
                    temp.put("maxCoocurence", maxCoocurence.getInt("maxCoocurence"));
                    rowsMax.add(temp);
                    temp = new JSONObject();
                }
                res.put("maxCoocurence", rowsMax);
            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject attributeRedescriptions(Map<String, String> request, DataBaseEnum database) {
        int userId, attribute1, attribute2;
        String numAttrs = "";
        userId=Integer.parseInt(request.get("userId"));
        numAttrs=request.get("numAttr");
        if(request.get("attribute1")==null) attribute1 = 0;
        else attribute1=Integer.parseInt(request.get("attribute1"));
        if(request.get("attribute2")==null) attribute2 = 0;
        else attribute2=Integer.parseInt(request.get("attribute2"));

        JSONObject res = new JSONObject();
        JSONArray redescriptions = new JSONArray();
        JSONArray redescriptionAttrs = new JSONArray();
        JSONArray selAttrs = new JSONArray();
        JSONArray attAssoc1 = new JSONArray();
        JSONArray attAssoc2 = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String attributeRedescriptionsString = "SELECT DISTINCT rt1.redescriptionID, rt1.redescriptionLR,  rt1.redescriptionRR, rt1.redescriptionJS, rt1.redescriptionSupport, rt1.redescriptionPval "+
                        "FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE "+
                        "rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rat1.attributeID="+attribute1+" "+
                        "AND rat2.attributeID = "+attribute2;
                ResultSet attributeRedescriptions = stmt.executeQuery(attributeRedescriptionsString);
                while(attributeRedescriptions.next())
                {
                    temp.put("id", attributeRedescriptions.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[5];
                    tmpArr[0]=attributeRedescriptions.getString("redescriptionLR");
                    tmpArr[1]=attributeRedescriptions.getString("redescriptionRR");
                    tmpArr[2]=attributeRedescriptions.getDouble("redescriptionJS");
                    tmpArr[3]=attributeRedescriptions.getInt("redescriptionSupport");
                    tmpArr[4]=attributeRedescriptions.getInt("redescriptionPval");
                    temp.put("data", tmpArr);
                    redescriptions.add(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptions", redescriptions);

                String selectedAttributeInfoString = "SELECT * FROM AttributeTable WHERE attributeID IN ("+attribute1+","+attribute2+")";
                ResultSet selectedAttributeInfo = stmt.executeQuery(selectedAttributeInfoString);
                while(selectedAttributeInfo.next())
                {
                    temp.put("attributeID", selectedAttributeInfo.getInt(1));
                    temp.put("attributeName", selectedAttributeInfo.getString(2));
                    temp.put("attributeDescription", selectedAttributeInfo.getString(3));
                    temp.put("view", selectedAttributeInfo.getInt(4));
                    selAttrs.add(temp);
                    temp = new JSONObject();
                }
                res.put("selAttrs", selAttrs);

                String attrAssoc1String = "SELECT distinct attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID2 AND act.attributeID1 = "+
                        attribute1+" AND at.attributeID IN ( SELECT attributeID2 from AttributeTable,AttributeCoocurenceTable where userId="+
                        userId+" and attributeID1 = "+attribute1+" and attributeID = attributeID2 "+
                        "and view=2 order by coocurence DESC LIMIT "+numAttrs+") order by coocurence DESC";
                ResultSet attrAssoc1 = stmt.executeQuery(attrAssoc1String);
                while(attrAssoc1.next())
                {
                    temp.put("id", attrAssoc1.getInt("attributeID"));
                    Object[] tmpArr = new Object[4];
                    tmpArr[0]=attrAssoc1.getString("attributeName");
                    tmpArr[1]=attrAssoc1.getString("attributeDescription");
                    tmpArr[2]=attrAssoc1.getInt("view");
                    tmpArr[3]=attrAssoc1.getInt("coocurence");
                    temp.put("data", tmpArr);
                    attAssoc1.add(temp);
                    temp = new JSONObject();
                }
                res.put("attAssoc1", attAssoc1);

                String attrAssoc2String = "SELECT distinct attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID1 AND act.attributeID2 = "+
                        attribute2+" AND at.attributeID IN ( SELECT attributeID1 from AttributeTable,AttributeCoocurenceTable where userId="+
                        userId+" and attributeID2 = "+attribute2+" and attributeID = attributeID1 "+
                        "and view=1 order by coocurence DESC LIMIT "+numAttrs+") order by coocurence DESC";
                ResultSet attrAssoc2 = stmt.executeQuery(attrAssoc2String);
                while(attrAssoc2.next())
                {
                    temp.put("id", attrAssoc2.getInt("attributeID"));
                    Object[] tmpArr = new Object[4];
                    tmpArr[0]=attrAssoc2.getString("attributeName");
                    tmpArr[1]=attrAssoc2.getString("attributeDescription");
                    tmpArr[2]=attrAssoc2.getInt("view");
                    tmpArr[3]=attrAssoc2.getInt("coocurence");
                    temp.put("data", tmpArr);
                    attAssoc2.add(temp);
                    temp = new JSONObject();
                }
                res.put("attAssoc2", attAssoc2);

                String attributesRL1String = "SELECT rat.redescriptionID, at.attributeID, attributeName, attributeDescription, view FROM AttributeTable as at, RedescriptionAttributeTable as rat WHERE "+
                        "at.attributeID = rat.attributeID AND rat.redescriptionID IN ("+
                        "SELECT DISTINCT rt1.redescriptionID FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE "+
                        "rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rat1.attributeID="+attribute1+" "+
                        "AND rat2.attributeID = "+attribute2+")";
                ResultSet attributesRL1 = stmt.executeQuery(attributesRL1String);
                while(attributesRL1.next())
                {
                    temp.put("id", attributesRL1.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[4];
                    tmpArr[0]=attributesRL1.getInt("attributeID");
                    tmpArr[1]=attributesRL1.getString("attributeName");
                    tmpArr[2]=attributesRL1.getString("attributeDescription");
                    tmpArr[3]=attributesRL1.getInt("view");
                    temp.put("data", tmpArr);
                    redescriptionAttrs.add(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptionAttrs", redescriptionAttrs);

            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
return res;
    }

    public JSONObject attributeRedescriptionsSel(Map<String, String> request, DataBaseEnum database) {
        int userId, attribute1, attribute2;
        String numAttrs="";
        userId=Integer.parseInt(request.get("userId"));
        numAttrs=request.get("numAttr");
        if(request.get("attribute1")==null) attribute1 = 0;
        else attribute1=Integer.parseInt(request.get("attribute1"));
        if(request.get("attribute2")==null) attribute2 = 0;
        else attribute2=Integer.parseInt(request.get("attribute2"));

        JSONObject res = new JSONObject();
        JSONArray redescriptions = new JSONArray();
        JSONArray redescriptionAttrs = new JSONArray();
        JSONArray selAttrs = new JSONArray();
        JSONArray attAssoc1 = new JSONArray();
        JSONArray attAssoc2 = new JSONArray();
        JSONObject temp = new JSONObject();
        try{
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();

            if(conn != null) {

                String attributeRedescriptionsString = "SELECT DISTINCT rt1.redescriptionID, rt1.redescriptionLR,  rt1.redescriptionRR, rt1.redescriptionJS, rt1.redescriptionSupport, rt1.redescriptionPval "+
                        "FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE "+
                        "rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rt1.redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsAttr WHERE userId = "+
                        userId+") AND rat1.attributeID="+attribute1+" "+
                        "AND rat2.attributeID = "+attribute2;
                ResultSet attributeRedescriptions = stmt.executeQuery(attributeRedescriptionsString);
                while(attributeRedescriptions.next())
                {
                    temp.put("id", attributeRedescriptions.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[5];
                    tmpArr[0]=attributeRedescriptions.getString("redescriptionLR");
                    tmpArr[1]=attributeRedescriptions.getString("redescriptionRR");
                    tmpArr[2]=attributeRedescriptions.getDouble("redescriptionJS");
                    tmpArr[3]=attributeRedescriptions.getInt("redescriptionSupport");
                    tmpArr[4]=attributeRedescriptions.getInt("redescriptionPval");
                    temp.put("data", tmpArr);
                    redescriptions.add(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptions", redescriptions);

                String selectedAttributeInfoString = "SELECT * FROM AttributeTable WHERE attributeID IN ("+attribute1+","+attribute2+")";
                ResultSet selectedAttributeInfo = stmt.executeQuery(selectedAttributeInfoString);
                while(selectedAttributeInfo.next())
                {
                    temp.put("attributeID", selectedAttributeInfo.getInt(1));
                    temp.put("attributeName", selectedAttributeInfo.getString(2));
                    temp.put("attributeDescription", selectedAttributeInfo.getString(3));
                    temp.put("view", selectedAttributeInfo.getInt(4));
                    selAttrs.add(temp);
                    temp = new JSONObject();
                }
                res.put("selAttrs", selAttrs);

                String attrAssoc1String = "SELECT distinct attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID2 AND act.attributeID1 = "+
                        attribute1+" AND at.attributeID IN ( SELECT attributeID2 from AttributeTable,AttributeCoocurenceTable where userId="+
                        userId+" and attributeID1 = "+attribute1+" and attributeID = attributeID2 "+
                        "and view=2 order by coocurence DESC LIMIT "+numAttrs+") order by coocurence DESC";
                ResultSet attrAssoc1 = stmt.executeQuery(attrAssoc1String);
                while(attrAssoc1.next())
                {
                    temp.put("id", attrAssoc1.getInt("attributeID"));
                    Object[] tmpArr = new Object[4];
                    tmpArr[0]=attrAssoc1.getString("attributeName");
                    tmpArr[1]=attrAssoc1.getString("attributeDescription");
                    tmpArr[2]=attrAssoc1.getInt("view");
                    tmpArr[3]=attrAssoc1.getInt("coocurence");
                    temp.put("data", tmpArr);
                    attAssoc1.add(temp);
                    temp = new JSONObject();
                }
                res.put("attAssoc1", attAssoc1);

                String attrAssoc2String = "SELECT distinct attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID1 AND act.attributeID2 = "+
                        attribute2+" AND at.attributeID IN ( SELECT attributeID1 from AttributeTable,AttributeCoocurenceTable where userId="+
                        userId+" and attributeID2 = "+attribute2+" and attributeID = attributeID1 "+
                        "and view=1 order by coocurence DESC LIMIT "+numAttrs+") order by coocurence DESC";
                ResultSet attrAssoc2 = stmt.executeQuery(attrAssoc2String);
                while(attrAssoc2.next())
                {
                    temp.put("id", attrAssoc2.getInt("attributeID"));
                    Object[] tmpArr = new Object[4];
                    tmpArr[0]=attrAssoc2.getString("attributeName");
                    tmpArr[1]=attrAssoc2.getString("attributeDescription");
                    tmpArr[2]=attrAssoc2.getInt("view");
                    tmpArr[3]=attrAssoc2.getInt("coocurence");
                    temp.put("data", tmpArr);
                    attAssoc2.add(temp);
                    temp = new JSONObject();
                }
                res.put("attAssoc2", attAssoc2);

                String attributesRL1String = "SELECT rat.redescriptionID, at.attributeID, attributeName, attributeDescription, view FROM AttributeTable as at, RedescriptionAttributeTable as rat WHERE "+
                        "at.attributeID = rat.attributeID AND rat.redescriptionID IN ("+
                        "SELECT DISTINCT rt1.redescriptionID FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE "+
                        "rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rt1.redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsAttr WHERE userId = "+
                        userId+") AND rat1.attributeID="+attribute1+" "+
                        "AND rat2.attributeID = "+attribute2+")";
                ResultSet attributesRL1 = stmt.executeQuery(attributesRL1String);
                while(attributesRL1.next())
                {
                    temp.put("id", attributesRL1.getInt("redescriptionID"));
                    Object[] tmpArr = new Object[4];
                    tmpArr[0]=attributesRL1.getInt("attributeID");
                    tmpArr[1]=attributesRL1.getString("attributeName");
                    tmpArr[2]=attributesRL1.getString("attributeDescription");
                    tmpArr[3]=attributesRL1.getInt("view");
                    temp.put("data", tmpArr);
                    redescriptionAttrs.add(temp);
                    temp = new JSONObject();
                }
                res.put("redescriptionAttrs", redescriptionAttrs);

            }
            conn.close();
        }
        catch(SQLException e){
            System.out.println(e.getMessage());
        }

        //System.out.println(res); 
        return res;
    }

    public JSONObject clusrmSettings(Map<String,String> request,DataBaseEnum database){
        JSONObject res = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONArray redescriptionArray = new JSONArray();
        //"\nulazi u clusrm i atributi su:" + request.get("selected"));
        String selected = request.get("selected");
        String[] selectedArr = selected.split(",");
        selectedArr[0] = selectedArr[0].substring(2, selectedArr[0].length() - 1);
        selectedAttrs = selectedArr[0];
        for(int i=1; i<selectedArr.length; i++) {
            if(i==selectedArr.length-1)
                selectedArr[i] = selectedArr[i].substring(1, selectedArr[i].length() - 2);
            else selectedArr[i] = selectedArr[i].substring(1, selectedArr[i].length() - 1);
            selectedAttrs += ";" + selectedArr[i];
        }
        Boolean[] w1Contains = new Boolean[selectedArr.length];
        Arrays.fill(w1Contains, false);
        Boolean[] w2Contains = new Boolean[selectedArr.length];
        Arrays.fill(w2Contains, false);
        Boolean[] trueArr = new Boolean[selectedArr.length];
        Arrays.fill(trueArr, true);
        //System.out.println("Condition w1:" + request.get("conditionw1"));
        //System.out.println("Condition w2:" + request.get("conditionw2"));
        String conditionw1 = request.get("conditionw1").substring(1, request.get("conditionw1").length() - 1);
        if(conditionw1.equals("none")) {
            selectedAttrs = "";
            for(int i=1; i<selectedArr.length; i++) {
                selectedAttrs += selectedArr[i];
                i=i+2;
                if(i<selectedArr.length)
                    selectedAttrs += ";";
            }
        }
        String conditionw2 = request.get("conditionw2").substring(1, request.get("conditionw2").length() - 1);
        if(conditionw2.equals("none")) {
            selectedAttrs = "";
            for(int i=0; i<selectedArr.length; i++) {
                selectedAttrs += selectedArr[i];
                i=i+2;
                if(i<selectedArr.length)
                    selectedAttrs += ";";
            }
        }
        Double numRandomRestarts = Double.parseDouble(request.get("numRandomRestarts"));
        Double numIterations = Double.parseDouble(request.get("numIterations"));
        Double numRetRed = Double.parseDouble(request.get("numRetRed"));
        Double minSupport = Double.parseDouble(request.get("minSupport"));
        Double maxSupport = Double.parseDouble(request.get("maxSupport"));
        Double minJS= Double.parseDouble(request.get("minJS"));
        Double maxPval = Double.parseDouble(request.get("maxPval"));
        String allowLeftNeg = request.get("allowLeftNeg").substring(1, request.get("allowLeftNeg").length() - 1);
        String allowRightNeg = request.get("allowRightNeg").substring(1, request.get("allowRightNeg").length() - 1);
        String allowLeftDisj = request.get("allowLeftDisj").substring(1, request.get("allowLeftDisj").length() - 1);
        String allowRightDisj = request.get("allowRightDisj").substring(1, request.get("allowRightDisj").length() - 1);
        boolean attImportanceW1 = false, attImportanceW2 = false, importatntAttrs = false, check1 = false, check2 = false;
        String path_file = "/Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/SettingsNoNet.set";
        List<String> newLines = new ArrayList<>();
        try {
            for (String line : Files.readAllLines(Paths.get(path_file), StandardCharsets.UTF_8)) {
                if (line.contains("Input1")) {
                    newLines.add(line.replace(line, "Input1 = /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/input1" + database.name + ".arff"));
                }
                else if (line.contains("Input2")) {
                    newLines.add(line.replace(line, "Input2 = /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/input2" + database.name + ".arff"));
                }
                else if (line.contains("numRandomRestarts")) {
                    newLines.add(line.replace(line, "numRandomRestarts = " + numRandomRestarts.intValue()));
                }
                else if (line.contains("numIterations")) {
                    newLines.add(line.replace(line, "numIterations = " + numIterations.intValue()));
                }
                else if (line.contains("numRetRed")) {
                    newLines.add(line.replace(line, "numRetRed = " + numRetRed.intValue()));
                }
                else if (line.contains("MinSupport")) {
                    newLines.add(line.replace(line, "MinSupport = " + minSupport.intValue()));
                }
                else if (line.contains("MaxSupport")) {
                    newLines.add(line.replace(line, "MaxSupport = " + maxSupport.intValue()));
                }
                else if (line.contains("minJS")) {
                    newLines.add(line.replace(line, "minJS = " + minJS));
                }
                else if (line.contains("maxPval")) {
                    newLines.add(line.replace(line, "maxPval = " + maxPval));
                }
                else if (line.contains("allowLeftNeg")) {
                    newLines.add(line.replace(line, "allowLeftNeg = " + allowLeftNeg));
                }
                else if (line.contains("allowRightNeg")) {
                    newLines.add(line.replace(line, "allowRightNeg = " + allowRightNeg));
                }
                else if (line.contains("allowLeftDisj")) {
                    newLines.add(line.replace(line, "allowLeftDisj = " + allowLeftDisj));
                }
                else if (line.contains("allowRightDisj")) {
                    newLines.add(line.replace(line, "allowRightDisj = " + allowRightDisj));
                }
                else if (line.contains("attributeImportanceW1")) {
                    newLines.add(line.replace(line, "attributeImportanceW1 = " + conditionw1));
                    attImportanceW1 = true;
                }
                else if (line.contains("attributeImportanceW2")) {
                    newLines.add(line.replace(line, "attributeImportanceW2 = " + conditionw2));
                    attImportanceW2 = true;
                }
                else if (line.contains("importantAttributes")) {
                    newLines.add(line.replace(line, "importantAttributes: " + selectedAttrs));
                    importatntAttrs = true;
                }
                else if (line.contains("elementImportance")) {
                    newLines.add(line.replace(line, "elementImportance = none"));
                    importatntAttrs = true;
                }
                else if (line.contains("importantElements")) {
                    newLines.add(line.replace(line, "importantElements: "));
                    importatntAttrs = true;
                }else {
                    newLines.add(line);
                }
            }
            if(attImportanceW1==false) newLines.add("attributeImportanceW1 = " + conditionw1);
            if(attImportanceW2==false) newLines.add("attributeImportanceW2 = " + conditionw2);
            if(importatntAttrs==false) newLines.add("importantAttributes: " + selectedAttrs);
            Files.write(Paths.get(path_file), newLines, StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        try {
            System.out.println("try catch pokretanje clusrm algoritma");
            Process proc = Runtime.getRuntime().exec("/Library/java/JavaVirtualMachines/jdk-16.0.1.jdk/Contents/Home/bin/java -jar /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/out/artifacts/RMWConstrainedAdaptive_jar/RMWConstrainedAdaptive.jar /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/SettingsNoNet.set");
            proc.waitFor();
        }
        catch(Throwable e){
            System.out.println("greška");
        }

        try {
            File myObj = new File("/Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/redescriptionsGuidedExperimentalIterativeNoNetworkTestingNew1.rr");
            Scanner myReader = new Scanner(myObj);
            int numberOfRedescriptions = 0;
            String w1R = "", w2R = "", JS = "", pValue = "", intersection = "";
            boolean next=false;
            List<String[]> coveredAll = new ArrayList<String[]>();
            List<String[]> attributeNames = new ArrayList<String[]>();
            List<String[]> attributeDescriptions = new ArrayList<String[]>();
            String[] covered = new String[0];
            String[] attrs = new String[0];
            String[] descriptions = new String[0];
            String[] names = new String[0];
            List<Set<Integer>> listOfElements = new ArrayList<Set<Integer>>();
            List<Set<Integer>> listOfAttributes = new ArrayList<Set<Integer>>();
            Set<Integer> Elements = new HashSet<Integer>();
            Set<Integer> Attributes = new HashSet<Integer>();
            double[][] AEJ = new double[0][0];
            double[][] AAJ = new double[0][0];
            String[] attributeNameAndDescr = new String[0];
            double[] sumAEJ = new double[0];
            double[] sumAAJ = new double[0];
            //double[] AAJ = new double[0];
            double[] maxAEJ = new double[0];
            double[] attJac = new double[0];
            DecimalFormat df = new DecimalFormat("0.00");
            double pValueDouble = 0, JSDouble = 0;
            Set<Integer> unionElements, intersectionElements, unionAttributes, intersectionAttributes;
            while (myReader.hasNextLine()) {
                String documentLine = myReader.nextLine();
                if(documentLine.startsWith("W1R: ")) {
                    w1R = documentLine.substring(5);
                    for(int i = 0; i<selectedArr.length; i++) {
                        if(documentLine.contains(selectedArr[i]))
                            w1Contains[i] = true;
                    }
                }
                if(documentLine.startsWith("W2R: ")) {
                    w2R = documentLine.substring(5);
                    for(int i = 0; i<selectedArr.length; i++) {
                        if(documentLine.contains(selectedArr[i]))
                            w2Contains[i] = true;
                    }
                }
                if(documentLine.startsWith("JS: ")) {
                    JS = documentLine.substring(4);
                    JSDouble = Double.parseDouble(JS);
                }
                if(documentLine.startsWith("p-value : ")) {
                    pValue = documentLine.substring(10);
                    pValueDouble = Double.parseDouble(pValue);
                }
                if(documentLine.startsWith("Support intersection: ")) intersection = documentLine.substring(22);
                if(documentLine.startsWith("Covered examples")) next=true;
                if(next==true) {
                    covered = myReader.nextLine().split(" ");
                    for(int k=0; k<covered.length; k++) {
                        covered[k] = covered[k].substring(1, covered[k].length() - 1);
                    }
                }

                if(conditionw1.equals("none"))
                    check1 = true;
                if(conditionw2.equals("none"))
                    check2 = true;
                if(conditionw1.equals("soft")) {
                    for(int i = 0; i<selectedArr.length; i++) {
                        if(w1Contains[i] == true)
                            check1 = true;
                    }
                }
                if(conditionw2.equals("soft")) {
                    for(int i = 0; i<selectedArr.length; i++) {
                        if(w2Contains[i] == true)
                            check2 = true;
                    }
                }
                if(conditionw1.equals("hard")) {
                    if(Arrays.equals(w1Contains, trueArr))
                        check1 = true;
                }
                if(conditionw2.equals("hard")) {
                    if(Arrays.equals(w2Contains, trueArr)) {
                        check2 = true;
                        //System.out.println(w2Contains);
                    }
                }
                check1=true; check2=true;
                if(w1R!="" && w2R!="" && JS!="" && pValue!="" && intersection!="" && next==true) {
                    if(check1 == true && check2 == true) {
                        //System.out.println(w1R + "\n" + w2R + "\n" + JS + "\n" + pValue);
                        numberOfRedescriptions++;
                        temp.put("id", numberOfRedescriptions);
                        temp.put("w1",w1R);
                        temp.put("w2",w2R);
                        String[] w1Attributes = w1R.split(" ");
                        String[] w2Attributes = w2R.split(" ");
                        int counter = 0;
                        for (int i = 0; i < w1Attributes.length; i++) {
                            if (!w1Attributes[i].equals("<=") && !w1Attributes[i].equals(">=") && !w1Attributes[i].equals("AND")
                                    && !w1Attributes[i].equals("") && !w1Attributes[i].equals("OR") && !w1Attributes[i].equals("NOT") && !w1Attributes[i].equals("(") && !w1Attributes[i].equals(")")) {
                                counter++;
                            }
                        }
                        for (int j = 0; j < w2Attributes.length; j++) {
                            if (!w2Attributes[j].equals("<=") && !w2Attributes[j].equals(">=") && !w2Attributes[j].equals("AND")
                                    && !w2Attributes[j].equals("") && !w2Attributes[j].equals("OR") && !w2Attributes[j].equals("NOT") && !w2Attributes[j].equals("(") && !w2Attributes[j].equals(")"))
                                counter++;
                        }
                        String[] myAttributes = new String[counter];
                        //System.out.println("duljina " + counter);
                        int size = 0;
                        for (int i = 0; i < w1Attributes.length; i++) {
                            if (!w1Attributes[i].equals("<=") && !w1Attributes[i].equals(">=") && !w1Attributes[i].equals("AND")
                                    && !w1Attributes[i].equals("") && !w1Attributes[i].equals("OR") && !w1Attributes[i].equals("NOT") && !w1Attributes[i].equals("(") && !w1Attributes[i].equals(")")) {
                                myAttributes[size] = w1Attributes[i];
                                size++;
                            }
                        }
                        for (int j = 0; j < w2Attributes.length; j++) {
                            if (!w2Attributes[j].equals("<=") && !w2Attributes[j].equals(">=") && !w2Attributes[j].equals("AND")
                                    && !w2Attributes[j].equals("") && !w2Attributes[j].equals("OR") && !w2Attributes[j].equals("NOT") && !w2Attributes[j].equals("(") && !w2Attributes[j].equals(")")) {
                                myAttributes[size] = w2Attributes[j];
                                size++;
                            }
                        }
                        attrs = new String[myAttributes.length/3];
                        int k=0;
                        for (int i = 0; i < myAttributes.length; i++) {
                           //System.out.println("myAttrs: " + myAttributes[i]);
                            attrs[k] = myAttributes[i];
                            i=i+2;
                            k++;
                        }
                        //temp.put("maxAEJ", df.format(maxAEJ));
                        //temp.put("AEJ", AEJ);
                        //temp.put("AAJ", AAJ);
                        temp.put("dfJS",df.format(JSDouble));
                        temp.put("attrs",attrs);
                        temp.put("JS",JSDouble);
                        temp.put("dfpValue",df.format(pValueDouble));
                        temp.put("pValue",pValueDouble);
                        temp.put("intersection", Integer.parseInt(intersection));
                        temp.put("covered", covered);
                        coveredAll.add(covered);
                        attributeNames.add(attrs);
                        redescriptionArray.add(temp);
                        temp = new JSONObject();
                        //maxAEJ = 0; //AEJ = new double[0]; //AAJ = new double[0];
                    }
                    check1 = false;
                    check2 = false;
                    Arrays.fill(w1Contains, false);
                    Arrays.fill(w2Contains, false);
                    w1R=""; w2R=""; JS=""; pValue=""; intersection=""; next=false;
                }

            }
            try {
                Connection conn = connect(database.databaseName);
                Statement stmt = conn.createStatement();
                if (conn != null) {
                    int element = 0;
                    int attr = 0;
                    int maxID = 0;
                    ResultSet maxRedescriptionId = stmt.executeQuery("SELECT MAX(redescriptionID) as maxId from RedescriptionTable");
                    while(maxRedescriptionId.next()){
                        maxID = maxRedescriptionId.getInt("maxId");
                    }
                    attributeNameAndDescr = new String[numberOfRedescriptions];
                    for(int j=0; j<numberOfRedescriptions;j++) {
                        for (int i = 0; i < coveredAll.get(j).length; i++) {
                            ResultSet ElementId = stmt.executeQuery("SELECT elementID from ElementTable WHERE elementName = " + coveredAll.get(j)[i]);
                            while (ElementId.next()) {
                                element = ElementId.getInt("elementID");
                            }
                            Elements.add(element);
                        }
                        listOfElements.add(Elements);
                        Elements = new HashSet<Integer>();
                        descriptions = new String[attributeNames.get(j).length];
                        for (int i = 0; i < attributeNames.get(j).length; i++) {
                            //System.out.println(attributeNames.get(j)[i]);
                            ResultSet AttributeId = stmt.executeQuery("SELECT attributeID, attributeDescription from AttributeTable WHERE attributeName = "+"\""+attributeNames.get(j)[i]+"\"");
                            while (AttributeId.next()) {
                                attr = AttributeId.getInt("attributeID");
                                descriptions[i] = AttributeId.getString("attributeDescription");
                            }
                            Attributes.add(attr);
                        }
                        attributeDescriptions.add(descriptions);
                        listOfAttributes.add(Attributes);
                        Attributes = new HashSet<Integer>();
                    }
                    AEJ = new double[numberOfRedescriptions][maxID+1];
                    AAJ = new double[numberOfRedescriptions][maxID+1];
                    sumAEJ = new double[numberOfRedescriptions];
                    sumAAJ = new double[numberOfRedescriptions];
                    attJac = new double[numberOfRedescriptions];
                    maxAEJ = new double[numberOfRedescriptions];
                    Set<Integer> redescriptionElements = new HashSet<Integer>();
                    Set<Integer> redescriptionAttributes = new HashSet<Integer>();
                    for(int i=0; i<=maxID; i++) {
                        redescriptionElements = new HashSet<Integer>();
                        String findNamesString = "SELECT elemetID as id " +
                                "FROM RedescriptionElementTable " +
                                "WHERE redescriptionID = " + i;
                        ResultSet findNames = stmt.executeQuery(findNamesString);
                        while (findNames.next()) {
                            redescriptionElements.add(findNames.getInt("id"));
                        }
                        String findAttrsString = "SELECT attributeID as id " +
                                "FROM RedescriptionAttributeTable " +
                                "WHERE redescriptionID = " + i;
                        ResultSet findAttrs = stmt.executeQuery(findAttrsString);
                        while (findAttrs.next()) {
                            redescriptionAttributes.add(findAttrs.getInt("id"));
                        }
                        for(int k=0; k<numberOfRedescriptions; k++) {
                            intersectionElements = new HashSet<Integer>(listOfElements.get(k));
                            intersectionElements.retainAll(redescriptionElements);
                            unionElements = new HashSet<>(listOfElements.get(k));
                            unionElements.addAll(redescriptionElements);
                            AEJ[k][i] = (double) intersectionElements.size() / unionElements.size();
                            sumAEJ[k] += AEJ[k][i];

                            intersectionAttributes = new HashSet<>(listOfAttributes.get(k));
                            intersectionAttributes.retainAll(redescriptionAttributes);
                            unionAttributes = new HashSet<>(listOfAttributes.get(k));
                            unionAttributes.addAll(redescriptionAttributes);
                            AAJ[k][i] = (double)intersectionAttributes.size()/unionAttributes.size();
                            sumAAJ[k] += AEJ[k][i];

                            if (AEJ[k][i] > maxAEJ[k]) {
                                maxAEJ[k] = Double.parseDouble(df.format(AEJ[k][i]));
                                attJac[k] = Double.parseDouble(df.format(AAJ[k][i]));
                                //System.out.println("max je sada: " + maxAEJ[k] + ", att je: "+ attJac[k] +" za i: " + i);
                                //System.out.println("presijek: " + intersectionElements);
                                //System.out.println("unija: " + unionElements);
                            }
                            if (AEJ[k][i] == maxAEJ[k]) {
                                if(attJac[k] < AAJ[k][i]) {
                                    maxAEJ[k] = Double.parseDouble(df.format(AEJ[k][i]));
                                    attJac[k] = Double.parseDouble(df.format(AAJ[k][i]));
                                    //System.out.println("max je sada: " + maxAEJ[k] + ", att je: "+ attJac[k] +" za i: " + i);
                                    //System.out.println("presijek: " + intersectionElements);
                                    //System.out.println("unija: " + unionElements);
                                }
                            }
                        }

                    }
                }
                conn.close();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }

            res.put("attributeDescr", attributeDescriptions);
            res.put("listOfAttributes", listOfAttributes);
            res.put("sumAAJ", sumAAJ);
            res.put("sumAEJ", sumAEJ);
            res.put("AEJs", AEJ);
            res.put("AAJs", AAJ);
            res.put("maxAEJs", maxAEJ);
            res.put("attJac", attJac);
            res.put("redescriptionsCLUS", redescriptionArray);
            System.out.println("Number of redescriptions: "+ numberOfRedescriptions);
            res.put("redescriptionsCountCLUS",numberOfRedescriptions);
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        res.put("selected",selectedAttrs);
        return res;
    }

    public JSONObject clusrmSettingsElements(JSONObject request,DataBaseEnum database) {

        JSONParser jsonParser = new JSONParser();
        String conditionElements= "";
        JSONArray selected = new JSONArray();
        JSONObject res = new JSONObject();
        JSONObject temp = new JSONObject();
        JSONArray redescriptionArray = new JSONArray();
        String allowLeftNeg="false", allowRightNeg="false", allowLeftDisj="false", allowRightDisj="false";
        Double numRandomRestarts = 1.0, numIterations = 50.0, numRetRed = 200.0, minSupport = 5.0, maxSupport = 120.0, minJS = 0.5, maxPval = 0.01;
        try {
            conditionElements = String.valueOf(request.get("conditionElements"));
            selected = (JSONArray) jsonParser.parse(String.valueOf(request.get("selected")));
            if(!String.valueOf(request.get("numRandomRestarts")).equals("null"))
                numRandomRestarts = Double.parseDouble(String.valueOf(request.get("numRandomRestarts")));
            if(!String.valueOf(request.get("numIterations")).equals("null"))
                numIterations = Double.parseDouble(String.valueOf(request.get("numIterations")));
            if(!String.valueOf(request.get("numRetRed")).equals("null"))
                numRetRed = Double.parseDouble(String.valueOf(request.get("numRetRed")));
            if(!String.valueOf(request.get("minSupport")).equals("null"))
                minSupport = Double.parseDouble(String.valueOf(request.get("minSupport")));
            if(!String.valueOf(request.get("maxSupport")).equals("null"))
                maxSupport = Double.parseDouble(String.valueOf(request.get("maxSupport")));
            if(!String.valueOf(request.get("minJS")).equals("null"))
                minJS= Double.parseDouble(String.valueOf(request.get("minJS")));
            if(!String.valueOf(request.get("maxPval")).equals("null"))
                maxPval = Double.parseDouble(String.valueOf(request.get("maxPval")));
            if(!String.valueOf(request.get("allowLeftNeg")).equals("null"))
                allowLeftNeg = String.valueOf(request.get("allowLeftNeg")).substring(1, String.valueOf(request.get("allowLeftNeg")).length() - 1);
            if(!String.valueOf(request.get("allowRightNeg")).equals("null"))
                allowRightNeg = String.valueOf(request.get("allowRightNeg")).substring(1, String.valueOf(request.get("allowRightNeg")).length() - 1);
            if(!String.valueOf(request.get("allowLeftDisj")).equals("null"))
                allowLeftDisj = String.valueOf(request.get("allowLeftDisj")).substring(1, String.valueOf(request.get("allowLeftDisj")).length() - 1);
            if(!String.valueOf(request.get("allowRightDisj")).equals("null"))
                allowRightDisj = String.valueOf(request.get("allowRightDisj")).substring(1, String.valueOf(request.get("allowRightDisj")).length() - 1);

        } catch (ParseException e) {
            e.printStackTrace();
        }
        String condition = conditionElements.substring(1, conditionElements.length() - 1);
        //System.out.println(minSupport);

        //System.out.println("condition: " + condition);
        //System.out.println(selected);

        String selectedElems = "";
        String[] selectedElemsArray = new String[selected.size()];
        int countEl = 0;
        List<Set<Integer>> listOfElementsCluster = new ArrayList<Set<Integer>>();
        Set<Integer> ElementsCluster = new HashSet<Integer>();

        Iterator<JSONObject> iterator = selected.iterator();
        while (iterator.hasNext()) {
            JSONObject element = iterator.next();
            Long myLong = (Long) element.get("id");
            try {
                Connection conn = connect(database.databaseName);
                Statement stmt = conn.createStatement();
                if (conn != null) {
                    ResultSet findElementName = stmt.executeQuery("SELECT elementName FROM ElementTable WHERE elementID = " + element.get("id"));
                    while (findElementName.next()) {
                        String elementName = findElementName.getString("elementName");
                        //System.out.println(elementName);
                        if(selectedElems == "") selectedElems += "\"" + elementName + "\"";
                        else selectedElems += ";\"" + elementName + "\"";
                        selectedElemsArray[countEl] = elementName;
                        countEl++;
                    }
                }
                conn.close();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }
            ElementsCluster.add(myLong.intValue());
            //System.out.println(myLong.intValue());
        }
        listOfElementsCluster.add(ElementsCluster);

        boolean elementImportance = false, importantElements = false, check1 = false, check2 = false;
        String path_file = "/Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/SettingsNoNet.set";
        List<String> newLines = new ArrayList<>();
        try {
            for (String line : Files.readAllLines(Paths.get(path_file), StandardCharsets.UTF_8)) {
                if (line.contains("Input1")) {
                    newLines.add(line.replace(line, "Input1 = /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/input1" + database.name + ".arff"));
                }
                else if (line.contains("Input2")) {
                    newLines.add(line.replace(line, "Input2 = /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/input2" + database.name + ".arff"));
                }
                else if (line.contains("numRandomRestarts")) {
                    newLines.add(line.replace(line, "numRandomRestarts = " + numRandomRestarts.intValue()));
                }
                else if (line.contains("numIterations")) {
                    newLines.add(line.replace(line, "numIterations = " + numIterations.intValue()));
                }
                else if (line.contains("numRetRed")) {
                    newLines.add(line.replace(line, "numRetRed = " + numRetRed.intValue()));
                }
                else if (line.contains("MinSupport")) {
                    newLines.add(line.replace(line, "MinSupport = " + minSupport.intValue()));
                }
                else if (line.contains("MaxSupport")) {
                    newLines.add(line.replace(line, "MaxSupport = " + maxSupport.intValue()));
                }
                else if (line.contains("minJS")) {
                    newLines.add(line.replace(line, "minJS = " + minJS));
                }
                else if (line.contains("maxPval")) {
                    newLines.add(line.replace(line, "maxPval = " + maxPval));
                }
                else if (line.contains("allowLeftNeg")) {
                    newLines.add(line.replace(line, "allowLeftNeg = " + allowLeftNeg));
                }
                else if (line.contains("allowRightNeg")) {
                    newLines.add(line.replace(line, "allowRightNeg = " + allowRightNeg));
                }
                else if (line.contains("allowLeftDisj")) {
                    newLines.add(line.replace(line, "allowLeftDisj = " + allowLeftDisj));
                }
                else if (line.contains("allowRightDisj")) {
                    newLines.add(line.replace(line, "allowRightDisj = " + allowRightDisj));
                }
                else if (line.contains("elementImportance")) {
                    newLines.add(line.replace(line, "elementImportance = " + condition));
                    elementImportance = true;
                }
                else if (line.contains("importantElements")) {
                    newLines.add(line.replace(line, "importantElements: " + selectedElems));
                    importantElements = true;
                }
                else if (line.contains("attributeImportanceW1")) {
                    newLines.add(line.replace(line, "attributeImportanceW1 = none"));
                }
                else if (line.contains("attributeImportanceW2")) {
                    newLines.add(line.replace(line, "attributeImportanceW2 = none"));
                }
                else if (line.contains("importantAttributes")) {
                    newLines.add(line.replace(line, "importantAttributes: "));
                }else {
                    newLines.add(line);
                }
            }
            if(elementImportance==false) newLines.add("elementImportance = " + condition);
            if(importantElements==false) newLines.add("importantElements: " + selectedElems);
            Files.write(Paths.get(path_file), newLines, StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        try {
            System.out.println("try catch pokretanje clusrm algoritma");
            Process proc = Runtime.getRuntime().exec("/Library/java/JavaVirtualMachines/jdk-16.0.1.jdk/Contents/Home/bin/java -jar /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/out/artifacts/RMWConstrainedAdaptive_jar/RMWConstrainedAdaptive.jar /Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/SettingsNoNet.set");
            proc.waitFor();
        }
        catch(Throwable e){
            System.out.println("greška");
        }

        try {
            File myObj = new File("/Users/ivakozjak/Desktop/diplomski/RMWConstrainedAdaptive/redescriptionsGuidedExperimentalIterativeNoNetworkTestingNew1.rr");
            Scanner myReader = new Scanner(myObj);
            int numberOfRedescriptions = 0;
            String w1R = "", w2R = "", JS = "", pValue = "", intersection = "";
            boolean next=false;
            List<String[]> coveredAll = new ArrayList<String[]>();
            List<String[]> attributeNames = new ArrayList<String[]>();
            String[] covered = new String[0];
            String[] attrs = new String[0];
            List<Set<Integer>> listOfElements = new ArrayList<Set<Integer>>();
            List<Set<Integer>> listOfAttributes = new ArrayList<Set<Integer>>();
            Set<Integer> Elements = new HashSet<Integer>();
            Set<Integer> Attributes = new HashSet<Integer>();
            JSONObject descriptions = new JSONObject();
            JSONArray descriptionsArr = new JSONArray();
            JSONArray descriptionsArray = new JSONArray();
            double[] sumAEJ = new double[0];
            double[] sumAAJ = new double[0];
            double[][] AEJ = new double[0][0];
            double[][] AAJ = new double[0][0];
            double[] EJsel = new double[0];
            double[] maxAEJ = new double[0];
            double[] attJac = new double[0];
            DecimalFormat df = new DecimalFormat("0.00");
            double pValueDouble = 0, JSDouble = 0;
            Set<Integer> unionElements, intersectionElements, intersectionElementsCluster, unionElementsCluster, unionAttributes, intersectionAttributes;
            while (myReader.hasNextLine()) {
                String documentLine = myReader.nextLine();
                if(documentLine.startsWith("W1R: ")) {
                    w1R = documentLine.substring(5);
                }
                if(documentLine.startsWith("W2R: ")) {
                    w2R = documentLine.substring(5);
                }
                if(documentLine.startsWith("JS: ")) {
                    JS = documentLine.substring(4);
                    JSDouble = Double.parseDouble(JS);
                }
                if(documentLine.startsWith("p-value : ")) {
                    pValue = documentLine.substring(10);
                    pValueDouble = Double.parseDouble(pValue);
                }
                if(documentLine.startsWith("Support intersection: ")) intersection = documentLine.substring(22);
                if(documentLine.startsWith("Covered examples")) next=true;
                if(next==true) {
                    covered = myReader.nextLine().split(" ");
                    for(int k=0; k<covered.length; k++) {
                        covered[k] = covered[k].substring(1, covered[k].length() - 1);
                    }
                }
                if(w1R!="" && w2R!="" && JS!="" && pValue!="" && intersection!="" && next==true) {
                    int countEqual = 0;
                    boolean check = false;
                    if(condition.equals("none")) check=true;
                    else if(condition.equals("soft")) {
                        countEqual = 0;
                        for(int i=0; i<selectedElemsArray.length; i++){
                            for(int j=0; j<covered.length; j++){
                                if(selectedElemsArray[i].equals(covered[j])) {
                                    check = true;
                                    countEqual++;
                                }
                            }
                        }
                    }
                    else if(condition.equals("hard")) {
                        countEqual = 0;
                        for(int i=0; i<selectedElemsArray.length; i++){
                            for(int j=0; j<covered.length; j++){
                                if(selectedElemsArray[i].equals(covered[j]))
                                    countEqual++;
                            }
                        }
                        if(countEqual== selectedElemsArray.length) check=true;
                    }
                    //System.out.println(countEqual);
                    if(check==true) {
                        numberOfRedescriptions++;
                        temp.put("id", numberOfRedescriptions);
                        temp.put("w1", w1R);
                        temp.put("w2", w2R);
                        String[] w1Attributes = w1R.split(" ");
                        String[] w2Attributes = w2R.split(" ");
                        int counter = 0;
                        for (int i = 0; i < w1Attributes.length; i++) {
                            if (!w1Attributes[i].equals("<=") && !w1Attributes[i].equals(">=") && !w1Attributes[i].equals("AND")
                                    && !w1Attributes[i].equals("") && !w1Attributes[i].equals("OR") && !w1Attributes[i].equals("NOT") && !w1Attributes[i].equals("(") && !w1Attributes[i].equals(")")) {
                                counter++;
                            }
                        }
                        for (int j = 0; j < w2Attributes.length; j++) {
                            if (!w2Attributes[j].equals("<=") && !w2Attributes[j].equals(">=") && !w2Attributes[j].equals("AND")
                                    && !w2Attributes[j].equals("") && !w2Attributes[j].equals("OR") && !w2Attributes[j].equals("NOT") && !w2Attributes[j].equals("(") && !w2Attributes[j].equals(")"))
                                counter++;
                        }
                        String[] myAttributes = new String[counter];
                        //System.out.println("duljina " + counter);
                        int size = 0;
                        for (int i = 0; i < w1Attributes.length; i++) {
                            if (!w1Attributes[i].equals("<=") && !w1Attributes[i].equals(">=") && !w1Attributes[i].equals("AND")
                                    && !w1Attributes[i].equals("") && !w1Attributes[i].equals("OR") && !w1Attributes[i].equals("NOT") && !w1Attributes[i].equals("(") && !w1Attributes[i].equals(")")) {
                                myAttributes[size] = w1Attributes[i];
                                size++;
                            }
                        }
                        for (int j = 0; j < w2Attributes.length; j++) {
                            if (!w2Attributes[j].equals("<=") && !w2Attributes[j].equals(">=") && !w2Attributes[j].equals("AND")
                                    && !w2Attributes[j].equals("") && !w2Attributes[j].equals("OR") && !w2Attributes[j].equals("NOT") && !w2Attributes[j].equals("(") && !w2Attributes[j].equals(")")) {
                                myAttributes[size] = w2Attributes[j];
                                size++;
                            }
                        }
                        attrs = new String[myAttributes.length / 3];
                        int k = 0;
                        for (int i = 0; i < myAttributes.length; i++) {
                            attrs[k] = myAttributes[i];
                            i = i + 2;
                            k++;
                        }
                        temp.put("dfJS", df.format(JSDouble));
                        temp.put("JS", JSDouble);
                        temp.put("attrs",attrs);
                        temp.put("dfpValue", df.format(pValueDouble));
                        temp.put("pValue", pValueDouble);
                        temp.put("intersection", Integer.parseInt(intersection));
                        temp.put("covered", covered);
                        coveredAll.add(covered);
                        attributeNames.add(attrs);
                        redescriptionArray.add(temp);
                        temp = new JSONObject();
                        //maxAEJ = 0; //AEJ = new double[0]; //AAJ = new double[0];
                    }
                    w1R=""; w2R=""; JS=""; pValue=""; intersection=""; next=false;
                }

            }
            try {
                Connection conn = connect(database.databaseName);
                Statement stmt = conn.createStatement();
                if (conn != null) {
                    String elementDescription = "";
                    int element = 0;
                    int attr = 0;
                    int maxID = 0;
                    ResultSet maxRedescriptionId = stmt.executeQuery("SELECT MAX(redescriptionID) as maxId from RedescriptionTable");
                    while(maxRedescriptionId.next()){
                        maxID = maxRedescriptionId.getInt("maxId");
                    }
                    for(int j=0; j<numberOfRedescriptions;j++) {
                        for (int i = 0; i < coveredAll.get(j).length; i++) {
                            ResultSet ElementId = stmt.executeQuery("SELECT elementID, elementDescription from ElementTable WHERE elementName = " + coveredAll.get(j)[i]);
                            while (ElementId.next()) {
                                element = ElementId.getInt("elementID");
                                elementDescription = ElementId.getString("elementDescription");
                            }
                            Elements.add(element);
                            descriptions.put("id", element);
                            descriptions.put("description", elementDescription);
                            descriptionsArr.add(descriptions);
                            descriptions = new JSONObject();
                        }
                        descriptionsArray.add(descriptionsArr);
                        descriptionsArr = new JSONArray();
                        listOfElements.add(Elements);
                        Elements = new HashSet<Integer>();
                        for (int i = 0; i < attributeNames.get(j).length; i++) {
                            //System.out.println(attributeNames.get(j)[i]);
                            ResultSet AttributeId = stmt.executeQuery("SELECT attributeID from AttributeTable WHERE attributeName = "+"\""+attributeNames.get(j)[i]+"\"");
                            while (AttributeId.next()) {
                                attr = AttributeId.getInt("attributeID");
                            }
                            Attributes.add(attr);
                            //System.out.println("atrId: " + attr + ", attrName: " + attributeNames.get(j)[i]);
                        }
                        //System.out.println("atributi za red: " + j + "su: " + attributeNames.get(j));
                        //System.out.println("tj, id-evi: " + Attributes);
                        listOfAttributes.add(Attributes);
                        Attributes = new HashSet<Integer>();
                    }
                    //System.out.println(listOfAttributes);
                    AEJ = new double[numberOfRedescriptions][maxID+1];
                    AAJ = new double[numberOfRedescriptions][maxID+1];
                    sumAEJ = new double[numberOfRedescriptions];
                    sumAAJ = new double[numberOfRedescriptions];
                    EJsel = new double[numberOfRedescriptions];
                    attJac = new double[numberOfRedescriptions];
                    maxAEJ = new double[numberOfRedescriptions];
                    Set<Integer> redescriptionElements = new HashSet<Integer>();
                    Set<Integer> redescriptionAttributes = new HashSet<Integer>();
                    for(int i=0; i<=maxID; i++) {
                        redescriptionElements = new HashSet<Integer>();
                        String findNamesString = "SELECT elemetID as id " +
                                "FROM RedescriptionElementTable " +
                                "WHERE redescriptionID = " + i;
                        ResultSet findNames = stmt.executeQuery(findNamesString);
                        while (findNames.next()) {
                            redescriptionElements.add(findNames.getInt("id"));
                        }
                        redescriptionAttributes = new HashSet<Integer>();
                        String findAttrsString = "SELECT attributeID as id " +
                                "FROM RedescriptionAttributeTable " +
                                "WHERE redescriptionID = " + i;
                        ResultSet findAttrs = stmt.executeQuery(findAttrsString);
                        while (findAttrs.next()) {
                            redescriptionAttributes.add(findAttrs.getInt("id"));
                        }
                        for(int k=0; k<numberOfRedescriptions; k++) {
                            intersectionElements = new HashSet<Integer>(listOfElements.get(k));
                            intersectionElements.retainAll(redescriptionElements);
                            intersectionElementsCluster = new HashSet<Integer>(listOfElementsCluster.get(0));
                            intersectionElementsCluster.retainAll(listOfElements.get(k));
                            unionElements = new HashSet<>(listOfElements.get(k));
                            unionElements.addAll(redescriptionElements);
                            unionElementsCluster = new HashSet<>(listOfElementsCluster.get(0));
                            unionElementsCluster.addAll(listOfElements.get(k));
                            AEJ[k][i] = (double) intersectionElements.size() / unionElements.size();
                            EJsel[k] = (double) intersectionElementsCluster.size() / unionElementsCluster.size();
                            EJsel[k] = Double.parseDouble(df.format(EJsel[k]));
                            sumAEJ[k] += AEJ[k][i];

                            intersectionAttributes = new HashSet<>(listOfAttributes.get(k));
                            intersectionAttributes.retainAll(redescriptionAttributes);
                            unionAttributes = new HashSet<>(listOfAttributes.get(k));
                            unionAttributes.addAll(redescriptionAttributes);
                            AAJ[k][i] = (double)intersectionAttributes.size()/unionAttributes.size();
                            sumAAJ[k] += AEJ[k][i];

                            if (AEJ[k][i] > maxAEJ[k]) {
                                maxAEJ[k] = Double.parseDouble(df.format(AEJ[k][i]));
                                attJac[k] = Double.parseDouble(df.format(AAJ[k][i]));
                                //System.out.println("max je sada: " + maxAEJ[k] + ", att je: "+ attJac[k] +" za i: " + i);
                                //System.out.println("presijek: " + intersectionElements);
                                //System.out.println("unija: " + unionElements);
                                //System.out.println("presjek s clusterom: " + intersectionElementsCluster);
                                //System.out.println("presijek atrs: " + intersectionAttributes);
                                //System.out.println("unija atrs: " + unionAttributes);
                            }
                            if (AEJ[k][i] == maxAEJ[k]) {
                                if(attJac[k] < AAJ[k][i]) {
                                    maxAEJ[k] = Double.parseDouble(df.format(AEJ[k][i]));
                                    attJac[k] = Double.parseDouble(df.format(AAJ[k][i]));
                                    //System.out.println("max je sada: " + maxAEJ[k] + ", att je: "+ attJac[k] +" za i: " + i);
                                    //System.out.println("presijek: " + intersectionElements);
                                    //System.out.println("unija: " + unionElements);
                                }
                            }
                        }

                    }
                }
                conn.close();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
            }
            res.put("descriptions", descriptionsArray);
            res.put("AEJs", AEJ);
            res.put("AAJs", AAJ);
            res.put("EJsel", EJsel);
            res.put("sumAEJ", sumAEJ);
            res.put("sumAAJ", sumAAJ);
            res.put("maxAEJs", maxAEJ);
            res.put("attJac", attJac);
            res.put("redescriptionsCLUS", redescriptionArray);
            System.out.println("Number of redescriptions: "+ numberOfRedescriptions);
            res.put("redescriptionsCountCLUS",numberOfRedescriptions);
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        res.put("selected",selectedAttrs);

        return res;
    }

    public JSONObject saveCLUSRMRedescriptions(JSONObject request,DataBaseEnum database) {

        JSONParser jsonParser = new JSONParser();
        JSONArray redescriptionsCLUS = new JSONArray();
        JSONArray AEJs = new JSONArray();
        JSONArray AAJs = new JSONArray();
        String selectedToSave = "";
        JSONArray covered = new JSONArray();
        JSONArray sumAAJ = new JSONArray();
        JSONArray sumAEJ = new JSONArray();
        String w1 = "", w2 = "";
        JSONObject res = new JSONObject();
        double AEJ = 0, AAJ = 0;
        Long userId = null;
        try {
            userId = (Long) jsonParser.parse(String.valueOf(request.get("userId")));
            selectedToSave = String.valueOf(request.get("selectedToSave"));
            redescriptionsCLUS = (JSONArray) jsonParser.parse(String.valueOf(request.get("redescriptionsCLUS")));
            AEJs = (JSONArray) jsonParser.parse(String.valueOf(request.get("AEJs")));
            AAJs = (JSONArray) jsonParser.parse(String.valueOf(request.get("AAJs")));
            sumAAJ = (JSONArray) jsonParser.parse(String.valueOf(request.get("sumAAJ")));
            sumAEJ = (JSONArray) jsonParser.parse(String.valueOf(request.get("sumAEJ")));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        //System.out.println(selectedToSave);

        String[] saveSelected = selectedToSave.split(" , ");
        saveSelected[0] = saveSelected[0].substring(1, saveSelected[0].length());
        saveSelected[saveSelected.length-1] = saveSelected[saveSelected.length-1].substring(0, saveSelected[saveSelected.length-1].length()-1);
        for(int a=0; a<saveSelected.length; a++)
            System.out.println(saveSelected[a]);

        Double[][] AEJSelected = new Double[saveSelected.length][saveSelected.length];
        Double[][] AAJSelected = new Double[saveSelected.length][saveSelected.length];
        Double[] sumNewAEJ = new Double[saveSelected.length];
        Double[] sumNewAAJ = new Double[saveSelected.length];

        for(int b=0; b<saveSelected.length; b++) {
            JSONObject redescriptionB = (JSONObject) redescriptionsCLUS.get(Integer.parseInt(saveSelected[b])-1);
            JSONArray coveredB = (JSONArray) redescriptionB.get("covered");
            Set<Object> coveredBSet = new HashSet<Object>();
            JSONArray attrsB = (JSONArray) redescriptionB.get("attrs");
            Set<Object> attrsBSet = new HashSet<Object>();
            for(int i=0; i<coveredB.size(); i++)
                coveredBSet.add(coveredB.get(i));
            for(int i=0; i<attrsB.size(); i++)
                attrsBSet.add(attrsB.get(i));

            AEJSelected[b][b] = Double.valueOf(1);
            AAJSelected[b][b] = Double.valueOf(1);

            sumNewAEJ[b] = (Double) sumAEJ.get(b);
            sumNewAAJ[b] = (Double) sumAAJ.get(b);

            for(int a=0; a<b; a++) {
                JSONObject redescriptionA = (JSONObject) redescriptionsCLUS.get(Integer.parseInt(saveSelected[a])-1);
                JSONArray coveredA = (JSONArray) redescriptionA.get("covered");
                Set<Object> coveredASet = new HashSet<Object>();
                for(int i=0; i<coveredA.size(); i++)
                    coveredASet.add(coveredA.get(i));
                HashSet<Object> intersectionElements = new HashSet<Object>(coveredBSet);
                intersectionElements.retainAll(coveredASet);
                HashSet<Object> unionElements = new HashSet<>(coveredBSet);
                unionElements.addAll(coveredASet);
                AEJSelected[a][b] = (double) intersectionElements.size() / unionElements.size();
                AEJSelected[b][a] = AEJSelected[a][b];
                sumNewAEJ[a] = (Double) sumAEJ.get(a) + AEJSelected[a][b];
                sumNewAEJ[b] = (Double) sumAEJ.get(b) + AEJSelected[a][b];

                JSONArray attrsA = (JSONArray) redescriptionA.get("attrs");
                Set<Object> attrsASet = new HashSet<Object>();
                for(int i=0; i<attrsA.size(); i++)
                    attrsASet.add(attrsA.get(i));
                HashSet<Object> intersectionAttrs = new HashSet<Object>(attrsBSet);
                intersectionAttrs.retainAll(attrsASet);
                HashSet<Object> unionAttrs = new HashSet<>(attrsBSet);
                unionAttrs.addAll(attrsASet);
                AAJSelected[a][b] = (double) intersectionAttrs.size() / unionAttrs.size();
                AAJSelected[b][a] = AAJSelected[a][b];
                //System.out.println("a: " + a + ", b:" + b);
                sumNewAAJ[a] = (Double) sumAAJ.get(a) + AAJSelected[a][b];
                sumNewAAJ[b] = (Double) sumAAJ.get(b) + AAJSelected[a][b];
            }
        }

        /*System.out.println("AEJ: " + AEJSelected);
        System.out.println("AAJ: " + AAJSelected);
        System.out.println("sumNewAEJ: " + sumNewAEJ);
        System.out.println("sumNewAAJ: " + sumNewAAJ);*/

        int count = saveSelected.length;
        try {
            Connection conn = connect(database.databaseName);
            Statement stmt = conn.createStatement();
            if (conn != null) {
                /*stmt.execute("DELETE FROM RedescriptionTable WHERE redescriptionID = 5448");
                stmt.execute("DELETE FROM RedescriptionElementTable WHERE redescriptionID = 5448");
                stmt.execute("DELETE FROM RedescriptionAttributeTable WHERE redescriptionID = 5448");*/
                int maxID = 0;
                ResultSet maxRedescriptionId = stmt.executeQuery("SELECT MAX(redescriptionID) as maxId from RedescriptionTable");
                while (maxRedescriptionId.next()) {
                    //System.out.println(maxRedescriptionId.getInt("maxId"));
                    maxID = maxRedescriptionId.getInt("maxId");
                }

                for(int i=0; i<=maxID; i++) {
                    double AEJupdate = 0, AAJupdate = 0;
                    ResultSet redescriptionAAJAEJ = stmt.executeQuery("SELECT redescriptionAEJ as AEJ, redescriptionAAJ as AAJ from RedescriptionTable " +
                            "WHERE redescriptionID = " +i);
                    while (redescriptionAAJAEJ.next()) {
                        AEJupdate = redescriptionAAJAEJ.getDouble("AEJ");
                        AAJupdate = redescriptionAAJAEJ.getDouble("AAJ");
                        //System.out.println(AEJupdate + ", " + AAJupdate);
                    }
                    AEJupdate = AEJupdate * (maxID-1);
                    AAJupdate = AAJupdate * (maxID-1);
                    int countToId = 0;
                    int updated = 0;
                    JSONArray aaj = new JSONArray();
                    Iterator<JSONArray> iterator = AAJs.iterator();
                    while(iterator.hasNext()){
                        countToId++;
                        for(int a=0; a<saveSelected.length; a++) {
                            if (countToId == Integer.parseInt(saveSelected[a])) {
                                updated++;
                                //System.out.println("ulazi za id=" + countToId);
                                aaj = iterator.next();
                                //System.out.println(aaj);
                                AAJupdate += (Double) Double.parseDouble("" + aaj.get(i));
                                //System.out.println("aaj update: " + AAJupdate);
                            }
                        }
                        if(updated == saveSelected.length) {
                            break;
                        }
                    }
                    countToId = 0;
                    JSONArray aej = new JSONArray();
                    Iterator<JSONArray> iterator2 = AEJs.iterator();
                    while(iterator2.hasNext()){
                        countToId++;
                        for(int a=0; a<saveSelected.length; a++) {
                            if (countToId == Integer.parseInt(saveSelected[a])) {
                                //System.out.println("ulazi za id=" + countToId);
                                aej = iterator.next();
                                AEJupdate += Double.parseDouble("" + aej.get(i));
                                //System.out.println("aej update: " + AEJupdate);
                            }
                        }
                        if(updated == saveSelected.length) {
                            break;
                        }
                    }
                    AEJupdate = AEJupdate / (maxID+count);
                    AAJupdate = AAJupdate / (maxID+count);
                    //System.out.println("update: "+AEJupdate + " " + AAJupdate);
                    stmt.execute("UPDATE RedescriptionTable SET redescriptionAEJ = " + AEJupdate +
                            ", redescriptionAEJ = " + AAJupdate + " where redescriptionID = " +i);
                }

            }
            conn.close();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        Iterator<JSONObject> iteratorRed = redescriptionsCLUS.iterator();
        while (iteratorRed.hasNext()) {
            JSONObject redescription = iteratorRed.next();
            for (int sel = 0; sel < saveSelected.length; sel++) {
                if ((Long)redescription.get("id") == Long.parseLong(saveSelected[sel])) {
                    //System.out.println("poklapa se za: " + redescription.get("id"));
                    int id = ((Long) redescription.get("id")).intValue();
                    //System.out.println(redescription);
                    AEJ = (double) sumNewAEJ[sel];
                    AAJ = (double) sumNewAAJ[sel];
                    covered = (JSONArray) redescription.get("covered");
                    Iterator<String> iterator = covered.iterator();
                    Set<String> Elements = new HashSet<String>();
                    while (iterator.hasNext()) {
                        String elemName = iterator.next();
                        Elements.add(elemName);
                    }
                    w1 = (String) redescription.get("w1");
                    w2 = (String) redescription.get("w2");
                    String[] w1Attributes = w1.split(" ");
                    String[] w2Attributes = w2.split(" ");
                    int counter = 0;
                    for (int i = 0; i < w1Attributes.length; i++) {
                        if (!w1Attributes[i].equals("<=") && !w1Attributes[i].equals(">=") && !w1Attributes[i].equals("AND")
                                && !w1Attributes[i].equals("") && !w1Attributes[i].equals("OR") && !w1Attributes[i].equals("NOT") && !w1Attributes[i].equals("(") && !w1Attributes[i].equals(")")) {
                            counter++;
                        }
                    }
                    for (int j = 0; j < w2Attributes.length; j++) {
                        if (!w2Attributes[j].equals("<=") && !w2Attributes[j].equals(">=") && !w2Attributes[j].equals("AND")
                                && !w2Attributes[j].equals("") && !w2Attributes[j].equals("OR") && !w2Attributes[j].equals("NOT") && !w2Attributes[j].equals("(") && !w2Attributes[j].equals(")"))
                            counter++;
                    }
                    String[] myAttributes = new String[counter];
                    //System.out.println("duljina " + counter);
                    int size = 0;
                    for (int i = 0; i < w1Attributes.length; i++) {
                        if (!w1Attributes[i].equals("<=") && !w1Attributes[i].equals(">=") && !w1Attributes[i].equals("AND")
                                && !w1Attributes[i].equals("") && !w1Attributes[i].equals("OR") && !w1Attributes[i].equals("NOT") && !w1Attributes[i].equals("(") && !w1Attributes[i].equals(")")) {
                            myAttributes[size] = w1Attributes[i];
                            size++;
                        }
                    }
                    for (int j = 0; j < w2Attributes.length; j++) {
                        if (!w2Attributes[j].equals("<=") && !w2Attributes[j].equals(">=") && !w2Attributes[j].equals("AND")
                                && !w2Attributes[j].equals("") && !w2Attributes[j].equals("OR") && !w2Attributes[j].equals("NOT") && !w2Attributes[j].equals("(") && !w2Attributes[j].equals(")")) {
                            myAttributes[size] = w2Attributes[j];
                            size++;
                        }
                    }
                    Set<String> Attributes = new HashSet<String>();
                    for (int i = 0; i < myAttributes.length; i++) {
                        Attributes.add(myAttributes[i]);
                        i = i + 2;
                    }
                    try {
                        Connection conn = connect(database.databaseName);
                        Statement stmt = conn.createStatement();
                        if (conn != null) {

                            int maxID = 0;
                            ResultSet maxRedescriptionId = stmt.executeQuery("SELECT MAX(redescriptionID) as maxId from RedescriptionTable");
                            while (maxRedescriptionId.next()) {
                                //System.out.println(maxRedescriptionId.getInt("maxId"));
                                maxID = maxRedescriptionId.getInt("maxId");
                            }

                            PreparedStatement insertPstmt = conn.prepareStatement("INSERT INTO RedescriptionTable VALUES (?,?,?,?,?,?,?,?)");
                            insertPstmt.setInt(1, maxID+1);
                            insertPstmt.setString(2, (String) redescription.get("w1"));
                            insertPstmt.setString(3, (String) redescription.get("w2"));
                            insertPstmt.setDouble(4, (Double) Double.parseDouble(""+redescription.get("JS")));
                            insertPstmt.setLong(5, (Long) Long.parseLong(""+redescription.get("intersection")));
                            insertPstmt.setDouble(6, Double.parseDouble(""+redescription.get("pValue")));
                            insertPstmt.setDouble(7, (Double)AEJ/maxID);
                            insertPstmt.setDouble(8, (Double)AAJ/maxID);
                            insertPstmt.executeUpdate();

                            for(int i=0; i<myAttributes.length; i++) {
                                int frequency = 0;
                                int[] myAttId = new int[2];
                                ResultSet freqAtt = stmt.executeQuery("SELECT frequency as freq from AttributeFrequencyTable " +
                                        "WHERE attributeName = "+"\""+myAttributes[i]+"\""+" AND userId = " + userId);
                                while (freqAtt.next()) {
                                    frequency = freqAtt.getInt("freq");
                                }
                                frequency++;
                                //System.out.println("freq: " + frequency);
                                stmt.execute("UPDATE AttributeFrequencyTable SET frequency = " + frequency +
                                        " where attributeName = "+"\""+myAttributes[i]+"\""+" AND userId = " + userId);
                                for(int j=0; j<myAttributes.length; j++) {
                                    if(i!=j){
                                        ResultSet attId = stmt.executeQuery("SELECT attributeID as id from AttributeFrequencyTable " +
                                                "WHERE attributeName = "+"\""+myAttributes[i]+"\"");
                                        while (attId.next()) {
                                            myAttId[0] = attId.getInt("id");
                                        }
                                        ResultSet attId2 = stmt.executeQuery("SELECT attributeID as id from AttributeFrequencyTable " +
                                                "WHERE attributeName = "+"\""+myAttributes[j]+"\"");
                                        while (attId2.next()) {
                                            myAttId[1] = attId2.getInt("id");
                                        }
                                        int cooc = 0;
                                        ResultSet coocAtt = stmt.executeQuery("SELECT coocurence as cooc from AttributeCoocurenceTable " +
                                                "WHERE attributeID1 = " + myAttId[0] + " AND attributeID2 = " + myAttId[1] + " AND userId = " + userId);
                                        while (freqAtt.next()) {
                                            cooc = coocAtt.getInt("cooc");
                                        }
                                        cooc++;
                                        //System.out.println("cooc: " + cooc);
                                        if(cooc == 1) {
                                            PreparedStatement insertCooc = conn.prepareStatement("INSERT INTO AttributeCoocurenceTable VALUES (?,?,?,?)");
                                            insertCooc.setLong(1, userId);
                                            insertCooc.setInt(2, cooc);
                                            insertCooc.setInt(3, myAttId[0]);
                                            insertCooc.setInt(4, myAttId[1]);
                                            insertCooc.executeUpdate();
                                        }
                                        else {
                                            stmt.execute("UPDATE AttributeCoocurenceTable SET coocurence = " + cooc +
                                                    " WHERE attributeID1 = " + myAttId[0] + " AND attributeID2 = " + myAttId[1] + " AND userId = " + userId);
                                        }
                                    }
                                }
                            }

                            for(int i=0; i<covered.size(); i++) {
                                int elId = 0, coverage = 0, coverageBack = 0;
                                    ResultSet ElementId = stmt.executeQuery("SELECT elementID from ElementTable WHERE elementName = "+"\""+covered.get(i)+"\"");
                                    while (ElementId.next()) {
                                        elId = ElementId.getInt("elementID");
                                    }
                                    PreparedStatement insertElem = conn.prepareStatement("INSERT INTO RedescriptionElementTable VALUES (?,?)");
                                    insertElem.setInt(1, maxID+1);
                                    insertElem.setInt(2, elId);
                                    insertElem.executeUpdate();

                                    ResultSet ElementCoverage = stmt.executeQuery("SELECT redescriptionCount from ElementCoverage WHERE elementID = "
                                            + elId + " AND userId = " + userId);
                                    while (ElementCoverage.next()) {
                                        coverage = ElementCoverage.getInt("redescriptionCount");
                                    }
                                    coverage++;
                                    if(coverage == 1) {
                                        PreparedStatement insertCov = conn.prepareStatement("INSERT INTO ElementCoverage VALUES (?,?,?)");
                                        insertCov.setLong(1, userId);
                                        insertCov.setInt(2, elId);
                                        insertCov.setInt(3, coverage);
                                        insertCov.executeUpdate();
                                    }
                                    else {
                                        stmt.execute("UPDATE ElementCoverage SET redescriptionCount = " + coverage +
                                                " where elementID = " + elId + " AND userId = " + userId);
                                    }

                                    ResultSet ElementCoverageBack = stmt.executeQuery("SELECT redescriptionCount from ElementCoverageBack WHERE elementID = " + elId);
                                    while (ElementCoverageBack.next()) {
                                        coverageBack = ElementCoverageBack.getInt("redescriptionCount");
                                    }
                                    coverageBack++;
                                    stmt.execute("UPDATE ElementCoverageBack SET redescriptionCount = " + coverage +
                                            " where elementID = " + elId);
                            }

                            /*for(int i=0; i<myAttributes.length; i++) {
                                int atId = 0, coverage = 0;
                                ResultSet AttrId = stmt.executeQuery("SELECT attributeID from AttributeTable WHERE attributeName = "+"\""+myAttributes[i]+"\"");
                                while (AttrId.next()) {
                                    atId = AttrId.getInt("attributeID");
                                }
                                    PreparedStatement insertAtr = conn.prepareStatement("INSERT INTO RedescriptionAttributeTable VALUES (?,?,?,?,?,?)");
                                    insertAtr.setInt(1, maxID+1);
                                    insertAtr.setInt(2, 0);
                                    insertAtr.setInt(3, atId);
                                    insertAtr.setDouble(4, Double.parseDouble(myAttributes[i+1]));
                                    insertAtr.setDouble(5, Double.parseDouble(myAttributes[i+2]));
                                    insertAtr.setInt(6, 0);
                                    insertAtr.executeUpdate();

                                i=i+2;
                            }*/

                            int numDis = 0;
                            String[] ruleString = new String[2];
                            ruleString[0]=w1;
                            ruleString[1]=w2;
                            for(int i=0; i<2; i++) {
                                if(i==1) numDis--;
                                String tmp1[] = ruleString[i].split(" OR ");
                                for (int z = 0; z < tmp1.length; z++) {
                                    int negated = 0;
                                    String tmpDis = tmp1[z];
                                   //System.out.println("tmpDis: " + tmpDis);
                                    if (tmpDis.contains("NOT")) {
                                        negated = 1;
                                        tmpDis = tmpDis.replace("NOT", "");
                                    }

                                    if (negated == 1) {
                                        tmpDis = tmpDis.replaceFirst("\\(", ""); //tmpDis=tmpDis.replaceAll("\\)","");
                                        if (tmpDis.contains(")")) {
                                            StringBuilder b = new StringBuilder(tmpDis);
                                            b.replace(tmpDis.lastIndexOf(")"), tmpDis.lastIndexOf(")") + 1, "");
                                            tmpDis = b.toString();
                                        }
                                    }
                                    else {
                                        tmpDis = tmpDis.replaceFirst("\\(", "");
                                        if (tmpDis.contains(")")) {
                                            StringBuilder b = new StringBuilder(tmpDis);
                                            b.replace(tmpDis.lastIndexOf(")"), tmpDis.lastIndexOf(")") + 1, "");
                                            tmpDis = b.toString();
                                        }
                                    }

                                    //tmpDis=tmpDis.trim(); tmpDis=tmpDis.replace(" ", "");
                                    String tmp[] = tmpDis.split(" AND ");//ruleString.split("AND");
                                    //System.out.println("tmpDis: " + tmpDis);
                                    for (int k = 0; k < tmp.length; k++) {
                                        tmp[k] = tmp[k].replace(" ", "");
                                        tmp[k] = tmp[k].trim();
                                        String atT = tmp[k];
                                        String aTT[] = null;

                                        if (atT.contains(">="))
                                            aTT = atT.split(">=");
                                        else
                                            aTT = atT.split("=");

                                        String aTT1[] = null;
                                        if (atT.contains("<=")) {
                                            if(aTT[1].contains(")"))
                                                aTT[1].replaceFirst("\\)", "");
                                            aTT1 = aTT[1].split("<=");
                                        } else {
                                            aTT1 = new String[2];
                                            aTT1[0] = null;
                                            aTT1[1] = null;
                                        }

                                        if(aTT[0].contains("("))
                                            aTT[0].replaceFirst("\\(", "");
                                        String atribute = aTT[0].trim();
                                        ArrayList<Double> boundaries = new ArrayList<>();
                                        //System.out.println("a1: " + atribute);
                                        //System.out.println("a2: " + aTT[1]);
                                        if (aTT1[0] != null)
                                            boundaries.add(Double.parseDouble(aTT1[0]));
                                        if (aTT1[1] != null)
                                            boundaries.add(Double.parseDouble(aTT1[1]));
                                        else
                                            boundaries.add(null);

                                        if (negated == 0) {
                                            //System.out.println(numDis + ", " + aTT1[0] + ", " + aTT1[1] + ", " + aTT[0] + ", " + negated);
                                            int atId = 0;
                                            ResultSet AttrId = stmt.executeQuery("SELECT attributeID from AttributeTable WHERE attributeName = "+"\""+aTT[0]+"\"");
                                            while (AttrId.next()) {
                                                atId = AttrId.getInt("attributeID");
                                            }
                                            PreparedStatement insertAtr = conn.prepareStatement("INSERT INTO RedescriptionAttributeTable VALUES (?,?,?,?,?,?)");
                                            insertAtr.setInt(1, maxID+1);
                                            insertAtr.setInt(2, numDis);
                                            insertAtr.setInt(3, atId);
                                            insertAtr.setDouble(4, Double.parseDouble(aTT1[0]));
                                            insertAtr.setDouble(5, Double.parseDouble(aTT1[1]));
                                            insertAtr.setInt(6, negated);
                                            insertAtr.executeUpdate();
                                        }
                                        else {
                                            //System.out.println(numDis + ", " + aTT1[0] + ", " + aTT1[1] + ", " + aTT[0] + ", " + negated);
                                            int atId = 0;
                                            ResultSet AttrId = stmt.executeQuery("SELECT attributeID from AttributeTable WHERE attributeName = "+"\""+aTT[0]+"\"");
                                            while (AttrId.next()) {
                                                atId = AttrId.getInt("attributeID");
                                            }
                                            PreparedStatement insertAtr = conn.prepareStatement("INSERT INTO RedescriptionAttributeTable VALUES (?,?,?,?,?,?)");
                                            insertAtr.setInt(1, maxID+1);
                                            insertAtr.setInt(2, numDis);
                                            insertAtr.setInt(3, atId);
                                            insertAtr.setDouble(4, Double.parseDouble(aTT1[0]));
                                            insertAtr.setDouble(5, Double.parseDouble(aTT1[1]));
                                            insertAtr.setInt(6, negated);
                                            insertAtr.executeUpdate();
                                        }
                                        if (negated == 1)
                                            numDis++;
                                    }
                                    if (negated == 0)
                                        numDis++;
                                }
                            }

                            PreparedStatement insertRed = conn.prepareStatement("INSERT INTO SelectedRedescriptionsElemBack VALUES (?)");
                            insertRed.setInt(1, maxID+1);
                            insertRed.executeUpdate();

                            PreparedStatement insertSelRed = conn.prepareStatement("INSERT INTO SelectedRedescriptionsAttr VALUES (?,?)");
                            insertSelRed.setLong(1, userId);
                            insertSelRed.setInt(2, maxID+1);
                            insertSelRed.executeUpdate();

                            JSONArray AEJsSelected = (JSONArray) AEJs.get(id-1);
                            JSONArray AAJsSelected = (JSONArray) AAJs.get(id-1);
                            for(int i=0; i<maxID+1; i++){
                                if(AEJsSelected.size()-i>0) {
                                    PreparedStatement insertGraph = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                                    insertGraph.setLong(1, i);
                                    insertGraph.setInt(2, maxID + 1);
                                    insertGraph.setDouble(3, (Double) Double.parseDouble("" + AEJsSelected.get(i)));
                                    insertGraph.executeUpdate();

                                    PreparedStatement insertGraph1 = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                                    insertGraph1.setLong(1, maxID + 1);
                                    insertGraph1.setInt(2, i);
                                    insertGraph1.setDouble(3, (Double) Double.parseDouble("" + AEJsSelected.get(i)));
                                    insertGraph1.executeUpdate();

                                    PreparedStatement insertGraphAttr = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                                    insertGraphAttr.setLong(1, i);
                                    insertGraphAttr.setInt(2, maxID + 1);
                                    insertGraphAttr.setDouble(3, (Double) Double.parseDouble("" + AAJsSelected.get(i)));
                                    insertGraphAttr.executeUpdate();

                                    PreparedStatement insertGraphAttr1 = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                                    insertGraphAttr1.setLong(1, maxID + 1);
                                    insertGraphAttr1.setInt(2, i);
                                    insertGraphAttr1.setDouble(3, (Double) Double.parseDouble("" + AAJsSelected.get(i)));
                                    insertGraphAttr1.executeUpdate();
                                }
                                else {
                                    //System.out.println("sel: " + sel);
                                    PreparedStatement insertGraph = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                                    insertGraph.setLong(1, i);
                                    insertGraph.setInt(2, maxID + 1);
                                    insertGraph.setDouble(3, (Double) AEJSelected[sel][(AAJsSelected.size()-i)*(-1)]);
                                    insertGraph.executeUpdate();

                                    PreparedStatement insertGraph1 = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                                    insertGraph1.setLong(1, maxID + 1);
                                    insertGraph1.setInt(2, i);
                                    insertGraph1.setDouble(3, (Double) AEJSelected[sel][(AAJsSelected.size()-i)*(-1)]);
                                    insertGraph1.executeUpdate();

                                    PreparedStatement insertGraphAttr = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                                    insertGraphAttr.setLong(1, i);
                                    insertGraphAttr.setInt(2, maxID + 1);
                                    insertGraphAttr.setDouble(3, (Double) AAJSelected[sel][(AAJsSelected.size()-i)*(-1)]);
                                    insertGraphAttr.executeUpdate();

                                    PreparedStatement insertGraphAttr1 = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                                    insertGraphAttr1.setLong(1, maxID + 1);
                                    insertGraphAttr1.setInt(2, i);
                                    insertGraphAttr1.setDouble(3, (Double) AAJSelected[sel][(AAJsSelected.size()-i)*(-1)]);
                                    insertGraphAttr1.executeUpdate();
                                }
                            }
                            PreparedStatement insertGraphEq = conn.prepareStatement("INSERT INTO GraphTable VALUES (?,?,?)");
                            insertGraphEq.setLong(1, maxID + 1);
                            insertGraphEq.setInt(2, maxID + 1);
                            insertGraphEq.setInt(3, 1);
                            insertGraphEq.executeUpdate();

                            PreparedStatement insertGraphEqAttr = conn.prepareStatement("INSERT INTO GraphTableAttr VALUES (?,?,?)");
                            insertGraphEqAttr.setLong(1, maxID + 1);
                            insertGraphEqAttr.setInt(2, maxID + 1);
                            insertGraphEqAttr.setInt(3, 1);
                            insertGraphEqAttr.executeUpdate();

                        }
                        conn.close();
                    } catch (SQLException e) {
                        System.out.println(e.getMessage());
                    }
                }
            }

        }
        return res;
    }
}
