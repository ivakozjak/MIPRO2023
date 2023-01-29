package com.example.interset.model;

public enum DataBaseEnum {
    TRADE("data/TradeRedescriptions.db", "Trade"),
    DBL("data/DBLPRedescriptions.db", "DBLP"),
    PHENOTYPE("data/PhenotypeRedescriptions.db", "Phenotype");

    public final String databaseName;
    public final String name;

    DataBaseEnum(String databaseName, String name) {
        this.databaseName = databaseName;
        this.name = name;
    }
}
