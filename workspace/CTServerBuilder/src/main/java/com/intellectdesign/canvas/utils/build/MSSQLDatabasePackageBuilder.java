package com.intellectdesign.canvas.utils.build;

import java.util.HashMap;

/**
 * This class prepares the Database setup package with Oracle as a base for MS SQL as the database.
 */
public class MSSQLDatabasePackageBuilder extends BaseDatabasePackageBuilder
{

	@Override
	public String getDatabaseName()
	{
		return "MSSQL";
	}
	
	@Override
	protected String getStatementTerminator()
	{
		return eol + "go";
	}

	@Override
	protected HashMap<String, String> getSQLDDLMap()
	{
		HashMap<String, String> hm = new HashMap<String, String>();
		hm.put("&&TABLE_TABLESPACE"," ");
		hm.put("&&INDEX_TABLESPACE"," ");
		hm.put("&&USE_INDEX_TABLESPACE"," ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,}\\){1}\\s{0,}(,){0,}"," INTEGER ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,},\\s{0,}([1-9]+)\\s{0,}\\){1}\\s{0,}"," NUMERIC ");		
		hm.put("\\s{1,}NUMBER\\s{0,}\\({1}\\s{0,}([\\d]+)\\s{0,},\\s{0,}([0]+)\\s{0,}\\){1}\\s{0,}"," INTEGER ");
		hm.put("\\s{1,}NUMBER.*,{1,1}"," INTEGER ,");
		hm.put("\\s{1,}NUMBER.*,{0}"," INTEGER ");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}\\){1}(,){0,}([-]{0,}.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}CHAR{1}\\){1}(,){0,}(.*)"," NVARCHAR($1)$2 $3");
		hm.put("\\s{1,}VARCHAR2\\s{0,}\\({1}([\\d]+)\\s{0,}BYTE{1}\\){1}(,){0,}([-]{0,}.*)"," VARCHAR($1)$2 $3");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}CHAR{1}\\){1}(,){0,}"," NVARCHAR($1)$2");
		hm.put("\\s{1,}CHAR\\s{0,}\\({1}([\\d]+)\\s{0,}BYTE{1}\\){1}(,){0,}"," VARCHAR($1)$2");
		hm.put("\\s{1,}CLOB"," TEXT");
		hm.put("\\s{1,}BLOB"," IMAGE");
		hm.put("\\s{1,}DATE([\\s\n]{1,})"," DATETIME$1");
		hm.put("\\s{1,}DATE,"," DATETIME,");		
		hm.put("\\s{1,}SYSDATE"," CURRENT_TIMESTAMP");
		hm.put("^\\s{1,}ALTER\\s{1,}TABLE\\s{1,}(\\w{1,})\\s{1,}MODIFY\\s{0,}\\((\\w{1,})\\s{1,}NOT\\s{1,}NULL\\s{1,}ENABLE\\)","ALTER TABLE $1 ALTER COLUMN <$2> :DATATYPE NOT NULL");
		hm.put("&&current_dir...","..");
		hm.put("^@{2}([[a-zA-Z0-9_/ .]+]{1,})(\\.([sql]{0,3})){1}",":r :fileLocation$1$2");		
		hm.put("^@{2}([^\\s.]{1,})(\\.([sql]{0,3})){1}",":r :fileLocation$1$2");
		hm.put("^@{2}([^\\s.]{1,})(\\.([sql]{0,3})){0}",":r :fileLocation$1.sql");
		hm.put("^\\s*spool[\\s]{0,}([\\w.]*$)","SET NOCOUNT ON" + eol + "go" + eol);
		hm.put("^\\s*spool[\\s]{0,}off","PRINT 'SCRIPT IS COMPLETE'"+ eol + "go" + eol);
		hm.put("^\\s*spool","-- spool");		
		hm.put("^\\s*PROMPT","PRINT");
		hm.put("CREATE(.*)SEQUENCE(.*)NOORDER(.*)","CREATE SEQUENCE $2 $3");		
		hm.put("CREATE(.*)SEQUENCE(.*)NOCYCLE(.*)","CREATE SEQUENCE $2 NO CYCLE $3");
		hm.put("COMMENT\\s*ON\\s*COLUMN\\s*(.*)\\.(.*)\\s*IS\\s*'(.*)'","EXEC sp_addextendedproperty @name = N'Caption',@value = '$3', @level0type = N'Schema', @level0name = '\\$\\(CT_SCHEMA\\)', @level1type = N'Table',  @level1name = '$1',@level2type = N'Column', @level2name = '$2' ");
		hm.put("COMMENT\\s*ON\\s*TABLE\\s*(.*)\\s*IS\\s*'(.*)'","EXEC sp_addextendedproperty @name = N'Caption',@value = '$2', @level0type = N'Schema', @level0name = '\\$\\(CT_SCHEMA\\)', @level1type = N'Table',  @level1name = '$1',@level2type = NULL, @level2name = NULL ");
		hm.put(">{2,}","' ");
		hm.put("<{2,}"," '");
		hm.put("commit;"," ");
		hm.put("set verify off"," ");
		hm.put("set verify on"," ");		
		hm.put("[\\s]ENABLE([\\s])|[\\s]ENABLE([;])|[\\s]ENABLE([,])|[\\s]ENABLE($)"," $1$2$3$4");
		hm.put("^/"," ");
		hm.put("\\\""," ");
		hm.put("[\\s]TIMESTAMP\\s*\\([\\d]\\)"," DATETIME ");
		hm.put("TO_DATE\\(('.........')s{0,},\\s{0,}'DD-MON-RR'\\)\\s{0,},"," $1,");		
		hm.put("to_date\\(('.........')s{0,},\\s{0,}'DD-MON-RR'\\)[+](\\d+)"," DATEADD(day,$2,$1)");		
		hm.put("to_date\\('(...........)( ........)','DD-MON-YYYY HH24:MI:SS'\\)"," '$1'");
		hm.put("REM ","\n-- REM ");
		hm.put("from dual"," from (select NO from LINE where NO=1) as a ");
		hm.put("(SET\\s{0,}DEFINE.*;{0,})","--$1");
		hm.put("^DEFINE (\\w{1,})='(\\w{1,})'",":setvar $1 \"$2\"");		
		hm.put("'&&(\\w{1,})'","'\\$\\($1\\)'");		
		hm.put("NOT\\s{0,}NULL\\s{0,},\\s{0,}--\\s{0,}COLLATE","COLLATE SQL_Latin1_General_CP1_CS_AS,");
		hm.put("^END;$"," ");
		hm.put("^BEGIN$"," ");
		hm.put("UPDATE\\s{1,}(\\w{1,})\\s{1,}((\\w{1,})\\s{1,})SET\\s{1,}(\\w{1,})\\s{0,}=\\s{0,}(\\(SELECT(.*)FROM\\s{1,}(.*)WHERE(.*)\\))",
		 "UPDATE $1 SET $4 = $5") ;
		return hm;
		
	}

	public static void main(String[] args)
	{
		new MSSQLDatabasePackageBuilder().build(args);
	}
}
