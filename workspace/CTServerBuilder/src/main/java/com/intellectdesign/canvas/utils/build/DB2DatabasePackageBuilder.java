/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.utils.build;

import java.util.HashMap;

/**
 * This class prepares the Database setup package with Oracle as a base for MS SQL as the database.
 * 
 * @Version 15.1.1
 */
public class DB2DatabasePackageBuilder extends BaseDatabasePackageBuilder
{
	@Override
	public String getDatabaseName()
	{
		return "DB2";
	}
	
	@Override
	protected HashMap<String, String> getSQLDDLMap()
	{
		HashMap<String, String> hm = new HashMap<String, String>();
		hm.put("&&TABLE_TABLESPACE"," ");
		hm.put("&&INDEX_TABLESPACE"," ");
		hm.put("&&USE_INDEX_TABLESPACE"," ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,}\\)\\s{0,}\\,"," NUMERIC , ");
        hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,}\\)\\s{0,}"," NUMERIC ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,},\\s{0,}([1-9]+)\\s{0,}\\){1}\\s{0,}"," NUMERIC($1,$2) ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,},\\s{0,}([0]+)\\s{0,}\\){1}\\s{0,}"," NUMERIC($1,$2) ");
        hm.put("\\s{1,}NUMBER\\s{1,}NOT\\s{1,}NULL{1,1}"," NUMERIC NOT NULL");
		hm.put("\\s{1,}NUMBER\\s{1,}NOT\\s{1,}NULL{0}"," NUMERIC NOT NULL");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\(.*\\)\\s{0,}\\,"," NUMERIC , ");
		hm.put("\\s{1,}NUMBER\\s{0,}\\(.*\\)\\s{0,}\\,"," NUMERIC , ");
		hm.put("\\s{1,}NUMBER\\s{0,},"," NUMERIC,");
		hm.put("\\s{1,}NUMBER\\s{1,}"," NUMERIC  ");
		hm.put("\\s{1,}NUMBER\\s{0,}\\)"," NUMERIC )  ");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}\\){1}(,){0,}([-]{0,}.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}CHAR{1}\\){1}(,){0,}(.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}BYTE{1}\\){1}(,){0,}([-]{0,}.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}CHAR{1}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}BYTE{1}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CLOB"," CLOB");
		hm.put("\\s{1,}BLOB"," BLOB");
		hm.put("\\s{1,}DATE([\\s\n]{1,})"," DATE$1");
		hm.put("\\s{1,}SYSDATE"," CURRENT_TIMESTAMP");
		hm.put("\\s{0,}NVL"," COALESCE");
		hm.put("\\s{0,}nvl"," coalesce");
		hm.put("\\s{0,}DUAL"," line from where no=1");
		hm.put("\\s{0,}dual"," line from where no=1");
		
		hm.put("\\s{0,}to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{4}-[0-9]{2}-[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'\\s{0,}DD-MON-RR\\s{0,}'\\s{0,}\\)", "TO_DATE('$1','YYYY-MM-DD')");
		hm.put("\\s{0,}TO_DATE\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{4}-[0-9]{2}-[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'\\s{0,}DD-MON-RR\\s{0,}'\\s{0,}\\)", "TO_DATE('$1','YYYY-MM-DD')");
			
		hm.put("\\s{0,}'([0-9]{1,2})-JAN-([0-9]{2})'", " '20$2-01-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-FEB-([0-9]{2})'", " '20$2-02-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-MAR-([0-9]{2})'", " '20$2-03-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-APR-([0-9]{2})'", " '20$2-04-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-MAY-([0-9]{2})'", " '20$2-05-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-JUN-([0-9]{2})'", " '20$2-06-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-JUL-([0-9]{2})'", " '20$2-07-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-AUG-([0-9]{2})'", " '20$2-08-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-SEP-([0-9]{2})'", " '20$2-09-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-OCT-([0-9]{2})'", " '20$2-10-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-NOV-([0-9]{2})'", " '20$2-11-$1'");
		hm.put("\\s{0,}'([0-9]{1,2})-DEC-([0-9]{2})'", " '20$2-12-$1'");
  
        hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}ADD\\s{1,}CONSTRAINT\\s{1,}(\\w{1,})\\s{0,}CHECK","REORG TABLE $1;\n ALTER TABLE $1 ADD CONSTRAINT $2 CHECK");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}ADD\\s{1,}CONSTRAINT\\s{1,}(\\w{1,})\\s{0,}PRIMARY\\s{1,}KEY","REORG TABLE $1;\n ALTER TABLE $1 ADD CONSTRAINT $2 PRIMARY KEY");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}ADD\\s{0,}PRIMARY\\s{1,}KEY","REORG TABLE $1;\n ALTER TABLE $1 ADD PRIMARY KEY");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{0,}\\((\\w{1,})\\s{1,}NOT\\s{1,}NULL\\s{1,}ENABLE\\)","REORG TABLE $1;\n ALTER TABLE $1 ALTER COLUMN $2 SET NOT NULL;\nREORG TABLE $1");
        
		hm.put("&&current_dir...","..");
		hm.put("^@{2}([[a-zA-Z0-9_/ .]+]{1,})(\\.([sql]{0,3})){1}",":fileLocation$1$2");		
		hm.put("^@{2}([^\\s.]{1,})(\\.([sql]{0,3})){1}",":fileLocation$1$2");
		hm.put("^@{2}([^\\s.]{1,})(\\.([sql]{0,3})){0}",":fileLocation$1.sql");
		
		hm.put("CREATE(.*)SEQUENCE(.*)NOORDER(.*)","CREATE SEQUENCE $2 $3");		
		hm.put("CREATE(.*)SEQUENCE(.*)NOCYCLE(.*)","CREATE SEQUENCE $2 NO CYCLE $3");
		hm.put("COMMENT\\s*ON\\s*COLUMN\\s*(.*)\\.(.*)\\s*IS\\s*'(.*)'","COMMENT ON COLUMN $1.$2 IS '$3'");
		
		hm.put("COMMENT\\s*ON\\s*TABLE\\s*(.*)\\s*IS\\s*'(.*)'","COMMENT ON TABLE $1 IS '$2'");
		hm.put(">{2,}","' ");
		hm.put("<{2,}"," '");
		hm.put("[\\s]ENABLE([\\s])|[\\s]ENABLE([;])|[\\s]ENABLE([,])|[\\s]ENABLE($)"," $1$2$3$4");
		//hm.put("^/"," ");
		hm.put("\\\""," ");
		hm.put("[\\s]TIMESTAMP\\s*\\([\\d]\\)"," TIMESTAMP");
    
		hm.put("\\s*CREATE\\s*UNIQUE\\s*INDEX\\s*(.*)\\s{1,}ON\\s*(.*)\\s*\\((.*)\\)","REORG TABLE $2;\n CREATE UNIQUE INDEX $1 ON $2 ($3)");
		hm.put("CREATE\\s*INDEX\\s*(.*)\\s{1,}ON\\s{1,}(.*)\\s{1,}\\((.*)\\)","REORG TABLE $2;\n CREATE INDEX $1 ON $2 ($3)");
		hm.put("\\s{0,}DEFINE\\s{1,}(\\w{1,})\\s{0,}=\\s{0,}'(\\w{1,})'","DEFINE $1 = '$2';");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{1,}(\\w{1,})\\s{1,}DEFAULT\\s{1,}(\\w{1,})","REORG TABLE $1;\n ALTER TABLE $1 ALTER $2 SET DEFAULT $3;\n REORG TABLE $1 ");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{1,}(\\w{1,})\\s{1,}DEFAULT\\s{1,}'(\\w{1,})'","REORG TABLE $1;\n ALTER TABLE $1 ALTER $2 SET DEFAULT '$3';\n REORG TABLE $1 ");
		hm.put("^\\s*--","--  asd");
		hm.put("\\s{0,}\\*\\*","/* * ");
		hm.put("^set verify off","");
		hm.put("^set define","--");
		hm.put("^SET DEFINE","--");
		
	
		return hm;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		DB2DatabasePackageBuilder builder = new DB2DatabasePackageBuilder();
		builder.build(args);
	}

}
