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
public class MYSQLDatabasePackageBuilder extends BaseDatabasePackageBuilder
{

	@Override
	public String getDatabaseName()
	{
		return "MYSQL";
	}
	
	@Override
	protected HashMap<String, String> getSQLDDLMap()
	{
		HashMap<String, String> hm = new HashMap<String, String>();
		hm.put("&&TABLE_TABLESPACE"," ");
		hm.put("&&INDEX_TABLESPACE"," ");
		hm.put("&&USE_INDEX_TABLESPACE"," ");			
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,}\\){1}\\s{0,}(,){0,}"," INTEGER ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,},\\s{0,}([1-9]+)\\s{0,}\\){1}\\s{0,}"," BIGINT ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,},\\s{0,}([0]+)\\s{0,}\\){1}\\s{0,}"," INTEGER ");
		hm.put("\\s{1,}NUMBER.*,{1,1}"," INTEGER,");
		hm.put("\\s{1,}NUMBER.*,{0}"," INTEGER");
		hm.put("\\s{1,}NUMBER\\s{1,}NOT\\s{1,}NULL,{1,1}"," INTEGER NOT NULL,");
		hm.put("\\s{1,}NUMBER\\s{1,}NOT\\s{1,}NULL,{0}"," INTEGER NOT NULL,");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}\\){1}(,){0,}([-]{0,}.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}CHAR{1}\\){1}(,){0,}(.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}BYTE{1}\\){1}(,){0,}([-]{0,}.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}CHAR{1}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}BYTE{1}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CLOB"," TEXT");
		hm.put("\\s{1,}BLOB"," BLOB");
		hm.put("\\s{1,}DATE([\\s\n]{1,})"," DATE$1");
		hm.put("\\s{1,}SYSDATE"," CURRENT_TIMESTAMP");
		
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-JAN-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-01-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-FEB-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-02-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-MAR-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-03-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-APR-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-04-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-MAY-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-05-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-JUN-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-06-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-JUL-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-07-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-AUG-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-08-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-SEP-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-09-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-OCT-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-10-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-NOV-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-11-$1 $3','%Y-%m-%d %H:%i:%s')");
		hm.put("to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{2})-DEC-([0-9]{4})\\s{0,}([0-9]{2}:[0-9]{2}:[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'DD-MON-YYYY\\s{0,}HH24:MI:SS'\\)", "STR_TO_DATE('$2-12-$1 $3','%Y-%m-%d %H:%i:%s')");
		
		hm.put("\\s{0,}to_date\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{4}-[0-9]{2}-[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'\\s{0,}DD-MON-RR\\s{0,}'\\s{0,}\\)", "STR_TO_DATE('$1','%Y-%m-%d')");
		hm.put("\\s{0,}TO_DATE\\s{0,}\\(\\s{0,}'\\s{0,}([0-9]{4}-[0-9]{2}-[0-9]{2})\\s{0,}'\\s{0,},\\s{0,}'\\s{0,}DD-MON-RR\\s{0,}'\\s{0,}\\)", "STR_TO_DATE('$1','%Y-%m-%d')");
		
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
		
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{0,}\\((\\w{1,})\\s{1,}NOT\\s{1,}NULL\\s{1,}ENABLE\\)","ALTER TABLE $1 MODIFY COLUMN <$2> :DATATYPE NOT NULL");
		hm.put("^@@","source :fileLocation");		
		hm.put("&&current_dir...","..");

		hm.put("^@{2}../([a-zA-Z0-9_/ ]+).sql","source ../$1.sql ");
		hm.put("^\\s*spool[\\s]{0,}([\\w.]*$)","TEE $1" + eol);
		hm.put("^\\s*spool[\\s]{0,}off","NoTEE");
		hm.put("^\\s*PROMPT","SELECT");
		hm.put("CREATE(.*)SEQUENCE(.*)NOORDER(.*)","CREATE SEQUENCE $2 $3");		
		hm.put("CREATE(.*)SEQUENCE(.*)NOCYCLE(.*)","CREATE SEQUENCE $2 NO CYCLE $3");
		hm.put("COMMENT\\s*ON\\s*COLUMN\\s*(.*)\\.(.*)\\s*IS\\s*'(.*)'","ALTER TABLE $1 MODIFY COLUMN <$2> :DATATYPE COMMENT '$3'");
		hm.put("COMMENT\\s*ON\\s*TABLE\\s*(.*)\\s*IS\\s*'(.*)'","SELECT 'adgccufgffg' ");
		hm.put(">{2,}","' ");
		hm.put("<{2,}"," '");
		hm.put("[\\s]ENABLE([\\s])|[\\s]ENABLE([;])|[\\s]ENABLE([,])|[\\s]ENABLE($)"," $1$2$3$4");
		hm.put("^/"," ");
		hm.put("\\\""," ");
		hm.put("[\\s]TIMESTAMP\\s*\\([\\d]\\)"," DATETIME");
		hm.put("TO_DATE\\(('.........'),'DD-MON-RR'\\)"," $1");
		hm.put("REM ","\n-- REM ");
		hm.put("(SET\\s{0,}DEFINE.*;{0,})","--$1");
		hm.put("NOT\\s{0,}NULL\\s{0,},\\s{0,}--\\s{0,}COLLATE","COLLATE SQL_Latin1_General_CP1_CS_AS,");
		hm.put("^\\s{0,}DEFINE\\s{1,}(.*)=(.*)","SET @$1=$2;");
		hm.put("DUAL","(SELECT 1 FROM LINE WHERE NO=1) A ");
		hm.put("'&&(\\w*)'","@$1");
		hm.put("([a-zA-Z0-9_/ .:\\\\]+)define_current_dir.sql","");
		hm.put("^BEGIN$","-- BEGIN");
		hm.put("^END\\s{0,};\\s{0,}$","-- END;");		
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{1,}(\\w{1,})\\s{1,}DEFAULT\\s{1,}(\\w{1,})","ALTER TABLE $1 ALTER $2 SET DEFAULT $3 ");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{1,}(\\w{1,})\\s{1,}DEFAULT\\s{1,}'(\\w{1,})'","ALTER TABLE $1 ALTER $2 SET DEFAULT '$3' ");
		hm.put("\\s{0,}\\*\\*","/* * ");
		hm.put("^set verify off","");
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}DROP\\s{1,}CONSTRAINT(\\s{1,}PK_\\w{1,})","ALTER TABLE $1 DROP PRIMARY KEY");		
		hm.put("^\\s{0,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}DROP\\s{1,}CONSTRAINT(\\s{1,}\\w{1,}Q)","ALTER TABLE $1 DROP INDEX $2");
		hm.put("\\\\&","&");
		hm.put("SET ESCAPE","-- SET ESCAPE");
		hm.put("CREATE\\s{1,}SEQUENCE\\s{1,}(\\w{1,})\\s{1,}MINVALUE\\s{1,}(\\d+)\\s{1,}MAXVALUE\\s{1,}(\\d+)\\s{1,}INCREMENT\\s{1,}BY\\s{1,}(\\d+)\\s{1,}START\\s{1,}WITH\\s{1,}(\\d+)(.*)",
				"insert into SEQUENCE_DATA (SEQUENCE_NAME, SEQUENCE_CUR_VALUE, SEQUENCE_MIN_VALUE,SEQUENCE_MAX_VALUE, SEQUENCE_INCREMENT ) value ('$1', $5, $2, $3,$4 );");		
		hm.put("UPDATE\\s{1,}(\\w{1,})\\s{1,}((\\w{1,})\\s{1,})SET\\s{1,}(\\w{1,})\\s{0,}=\\s{0,}(\\(SELECT(.*)FROM\\s{1,}(.*)WHERE(.*)\\))","UPDATE $1 $2, $5 AS A SET $3.$4 = A.$4") ;				
		hm.put("create or replace synonym\\s{1,}(.*)\\s{1,}for\\s{1,}(.*)","create view $1 as select * from $2");
		hm.put("GRANT\\s{1,}(.*) ON\\s{1,}(.*) to\\s{1,}(.*)","GRANT $1 ON $2 TO 'USER'@'HOST';");
		return hm;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		new MYSQLDatabasePackageBuilder().build(args);
	}
}
