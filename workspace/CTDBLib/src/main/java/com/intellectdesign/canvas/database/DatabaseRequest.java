/***************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *****************************************************************/

package com.intellectdesign.canvas.database;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * This class contains the methods to create request for database operations such as insert, select..etc and to set
 * pagination, sorting and additional filter condition definitions to be applied on the resultset
 * 
 * @version 1.0
 */
public class DatabaseRequest
{
	/**
	 * This public constructor sets the default values
	 */
	public DatabaseRequest()
	{
		dbLogger.ctdebug("CTDBL00035");
		setDBAccessImpl(DatabaseConstants.ACCESS_VIA_IBATIS);
		setOperation(DatabaseConstants.SELECT);
		setDataAccessMapKey(DatabaseConstants.DEFAULT_DATA_ACCECC_MAP_KEY);
		setDataSource();
		setDatabaseAccessManager(new DatabaseAccessManager());
		dbLogger.ctinfo("CTDBL00034");
	}

	/**
	 * This retrieves certain portion of rows starting from the specified rowNo from the resultset (typically for
	 * supporting pagination).
	 * 
	 * StartRowNo should be a value greater than zero but less than endRowNo. If this condition is not met, the values
	 * would not be respected; the query for this databaserequest will return all the rows
	 * 
	 * @param stRowNo Start Row No to be set
	 */
	public void setStartRowNo(int stRowNo)
	{
		dbLogger.ctdebug("CTDBL00036", stRowNo);
		startRowNo = stRowNo;
	}

	/**
	 * This method retrieves certain portion of rows ending at the specified rowNo from the resultset.
	 * 
	 * The value should be greater than zero and should always be greater than startRowNo If this condition is not met,
	 * then the values would not be respected; the query for this databaserequest will return all the rows
	 * 
	 * @param pEndRowNo End Row No to be set
	 */
	public void setEndRowNo(int pEndRowNo)
	{
		dbLogger.ctdebug("CTDBL00037", pEndRowNo);
		endRowNo = pEndRowNo;
	}

	/**
	 * Overloaded method of setStartRowNo(int)
	 * 
	 * <p>
	 * Note: passing null would throw a NullPointerException
	 * </p>
	 * 
	 * @param staRowNos start row no to be set to the paginated query
	 */
	public void setStartRowNo(Integer staRowNos)
	{
		setStartRowNo(staRowNos.intValue());
	}

	/**
	 * overloaded method of setEndRowNo(int)
	 * 
	 * <p>
	 * Note: passing null would throw a NullPointerException
	 * </p>
	 * 
	 * @param endRowNos row no to be set to the paginated query
	 */
	public void setEndRowNo(Integer endRowNos)
	{
		setEndRowNo(endRowNos.intValue());
	}

	/**
	 * This method sets the start and end row number using the pagination model
	 * 
	 * @param pm PaginationModel
	 */
	public void setPaginationModel(PaginationModel pm)
	{
		if (pm != null)
		{
			addFilter(DatabaseConstants.PAGINATION_MODEL, pm);
		}
	}

	/**
	 * This method sets the sortingmodel directly in the sql map file
	 * 
	 * @param sortModel
	 */
	public void setSortingModel(SortingModel sortModel)
	{
		if (sortModel != null)
		{
			addFilter(DatabaseConstants.SORTING_MODEL, sortModel);
		}
	}

	/**
	 * This method combines setStartRowNo and setEndRowNo in a single call. Use this api to retrieve a portion of rows
	 * from the resultset (typically for supporting pagination).
	 * 
	 * The startRowNo and endRowNo value should not be less than zero and startRowNo should always be less than endRowNo
	 * If this condition is not met, then the values would not be respected; the query for this databaserequest will
	 * return all the rows
	 * 
	 * @param start - the Start Row No
	 * @param end - the end Row Number
	 */
	public void setStartAndEndRowNos(int start, int end)
	{
		setStartRowNo(start);
		setEndRowNo(end);
	}

	/**
	 * This method returns true or false after validating the start and end row numbers startRowNo and endRowNo should
	 * be greater than 0 and startRowNo should be less than endRowNo
	 * 
	 * @return validFlag true if the values meet the above conditions, else false
	 */
	public boolean isValidStartAndEndRowNos()
	{
		boolean validFlag = true;

		if (getStartRowNo() < 0 || getEndRowNo() < 0)
			validFlag = false;
		else if (getStartRowNo() > getEndRowNo())
			validFlag = false;
		else
			validFlag = true;

		return validFlag;
	}

	/**
	 * This method decides which db operation should be executed on the database
	 * 
	 * The default value is DatabaseConstants.SELECT
	 * 
	 * This property should be set when a different database operation need to be executed. Refer the DatabaseConstants
	 * for the list of various DatabaseOperations
	 * 
	 * @param operationToPerform value to indicate the type of db operation
	 */
	public void setOperation(int operationToPerform)
	{
		dbLogger.ctdebug("CTDBL00038", operationToPerform);
		operation = operationToPerform;
	}

	/**
	 * This method sets operationExtension. The default value is nothing (""). Use this property when the application
	 * needs multiple variants of the same operation Ex: Two inserts for a single dataAccessMap.
	 * 
	 * The extension can be anything as required by the application, correspondingly the sqlmap file should use the same
	 * extension for the statements.
	 * 
	 * @param operationExt value of the operation done in Database
	 */
	public void setOperationExtension(String operationExt)
	{
		dbLogger.ctdebug("CTDBL00039", operationExt);
		operationExtension = operationExt;
	}

	/**
	 * This method adds the filters with query. Call this method to add a new filter. This method puts the filter keys
	 * and values into queryFilters Map
	 * 
	 * @param key keys should be the filter columns
	 * @param value value should be the filter-values
	 */
	@SuppressWarnings("unchecked")
	public void addFilter(String key, Object value)
	{
		dbLogger.ctdebug("CTDBL00040", key, value == null ? "null" : value);
		queryFilters.put(key, value);
	}

	/**
	 * This method adds record of data to batch for batchInsert
	 * 
	 * @param oneRowInABatch Hasmap of one row data to add as batch for batchinsert
	 */
	@SuppressWarnings(
	{ "unchecked", "rawtypes" })
	public void addDataToBatch(HashMap oneRowInABatch)
	{
		dbLogger.ctdebug("CTDBL00041", oneRowInABatch);
		getBatchData().add(oneRowInABatch);
	}

	/**
	 * This method decides which db access f/w to use for access database
	 * 
	 * The default value is DatabaseConstants.ACCESS_VIA_IBATIS This property should be used if and only if a different
	 * databaseaccess f/w is to be used.
	 * 
	 * @param accessVia to be set for the operation done in Database
	 */
	public void setDBAccessImpl(String accessVia)
	{
		dbLogger.ctdebug("CTDBL00042", accessVia);
		dbAccessImp = accessVia;
	}

	/**
	 * Setter for dataAccessMapKey field. This method decides which SQL element should mapped in the xml file. The
	 * default value is DatabaseConstants.DEFAULT_DATA_ACCECC_MAP_KEY.
	 * 
	 * @param akey namespace attribute that is defined in the sqlmap file
	 */
	public void setDataAccessMapKey(String akey)
	{
		dbLogger.ctdebug("CTDBL00043", akey);
		dataAccessMapKey = akey;
	}

	/**
	 * This method decides which dataSource should be accesed by the persistent layer The default value is
	 * DatabaseConstants.DATASOURCE_JNDI
	 * 
	 */
	public void setDataSource()
	{
		dataSource = DatabaseConstants.DEFAULT_DATASOURCE;
	}

	/**
	 * This method decides which dataSource should be accesed by the persistent layer The default value is
	 * DatabaseConstants.DATASOURCE_JNDI
	 * 
	 * @param dataSourcekey dataSource name of the DataSource
	 */
	public void setDataSource(String dataSourcekey)
	{
		dataSource = dataSourcekey;
	}

	/**
	 * This method decides which data fields should be passed into SQL by db operation
	 * 
	 * @param dataMap the data to be updated/inserted
	 */
	@SuppressWarnings("rawtypes")
	public void setData(Map dataMap)
	{
		dbLogger.ctdebug("CTDBL00044");
		data = dataMap;
	}

	/**
	 * This class provides the batchData used for batch insert If the batchData is empty, initializes the List to a new
	 * arraylist
	 * 
	 * @return List records of data added in the batchinsert
	 */
	@SuppressWarnings("rawtypes")
	public List getBatchData()
	{
		if (batchData == null)
			batchData = new ArrayList();
		return batchData;
	}

	/**
	 * This method sets the batchData used for batch insert
	 * 
	 * <p>
	 * Note: Either use this setBatchData() method or use addDataToBatch() method Do not use both methods
	 * </p>
	 * 
	 * @param batchData records of data to add in batch insert
	 */
	@SuppressWarnings("rawtypes")
	public void setBatchData(List batchData)
	{
		dbLogger.ctdebug("CTDBL00045");
		this.batchData = batchData;
	}

	/**
	 * This method decides which db operation to be executed on the database
	 * 
	 * @return operation int value of the operation to be done in Database
	 */
	public int getOperation()
	{
		return operation;
	}

	/**
	 * This method returns the operationExtension used for adding records. Refer the setter for details about this
	 * field.
	 * 
	 * @return operationExtension
	 */
	public String getOperationExtension()
	{
		return operationExtension;
	}

	/**
	 * This method returns the Mapping of the filters as key and value that were set by the client
	 * 
	 * @return queryFilters Mapping of queryFilters as keys and values to be used in the db operation
	 */
	@SuppressWarnings("rawtypes")
	public Map getFilters()
	{
		return queryFilters;
	}

	/**
	 * This method returns which db access f/w to use for accessing database The default value is
	 * DatabaseConstants.ACCESS_VIA_IBATIS
	 * 
	 * @return dbAccessImp String dbAccessImp for access f/w selection
	 */
	public String getDBAccessImpl()
	{
		return dbAccessImp;
	}

	/**
	 * This method returns which sql element to be mapped in the xml file The default value is DatabaseConstants.DEFAULT @return
	 * String damNam which element of xml to be mapped
	 * 
	 * @return dataAccessMapKey
	 */
	public String getDataAccessMapKey()
	{
		return dataAccessMapKey;
	}

	/**
	 * This method returns the dataSource to be accesed by the persistent layer The The default value is
	 * DatabaseConstants.DATASOURCE_JNDI DataSource
	 * 
	 * @return dataSource
	 */
	public String getDataSource()
	{
		return dataSource;
	}

	/**
	 * This method returns resultObject that is set after each of the various db operation
	 * 
	 * This resultObject holds the resultset of last executed db operation and can be obtained by client for future use
	 * 
	 * @return resultObject
	 * 
	 *         resultObject that can be used by the client for later use
	 */
	public DatabaseResult getDatabaseResult()
	{
		return resultObject;
	}

	/**
	 * This method decides the data fields to be passed into sql by db operation *
	 * 
	 * @return data Maping of data fields and its value
	 */
	@SuppressWarnings("rawtypes")
	protected Map getData()
	{
		return data;
	}

	/**
	 * This method sets the resultObject after db operation by the DatabaseAccessaManager class
	 * 
	 * @param dbresult dbresult to be set by the persistent layer for the client layer's use
	 */
	protected void setDatabaseResult(DatabaseResult dbresult)
	{
		dbLogger.ctdebug("CTDBL00046");
		resultObject = dbresult;
	}

	/**
	 * The method performs the required db operation and returns the result
	 * <p>
	 * Use this method after all the values are set on the request object
	 * <p>
	 * 
	 * @return resultObject The result object after executing the dboperation
	 * 
	 * @throws DatabaseException when exception occurs
	 */
	public DatabaseResult execute() throws DatabaseException
	{
		PerformanceTimer dbRequestExecute = new PerformanceTimer();
		dbRequestExecute.startTimer("DatabaseAccessManager.executeDBRequest DataAccessKey = "
				+ this.getDataAccessMapKey() + " Operation = " + this.getOperation() + " OperationExtn = "
				+ this.getOperationExtension());
		dbLogger.ctinfo("CTDBL00047");
		resultObject = getDatabaseAccessManager().executeDBRequest(this);
		dbLogger.ctinfo("CTDBL00048");
		dbRequestExecute.endTimer();
		return resultObject;
	}

	/**
	 * This method clears the clearst the filter-values from QuerFilter columns
	 * 
	 */
	public void clearFilters()
	{
		dbLogger.ctdebug("CTDBL00049");
		queryFilters.clear();
	}

	/**
	 * This method provides the database accessmanager for this request
	 * 
	 * @return dam Returns the dam.
	 */
	protected DatabaseAccessManager getDatabaseAccessManager()
	{
		return dam;
	}

	/**
	 * This method sets the DatbaseAccessManager for this request
	 * 
	 * @param adam The dam to set.
	 */
	protected void setDatabaseAccessManager(DatabaseAccessManager adam)
	{
		dbLogger.ctdebug("CTDBL00050");
		dam = adam;
	}

	/**
	 * This method returns the value of the startRowNo
	 * 
	 * @return startRowNo value of the startRowNo
	 */
	public int getStartRowNo()
	{
		return startRowNo;
	}

	/**
	 * This method returns the value of the endRowNo
	 * 
	 * @return endRowNo - the endRowNo
	 */
	public int getEndRowNo()
	{
		return endRowNo;
	}

	// The starting row from which to fetch the data, the default value is -1.
	private int startRowNo = -1;

	// The row upto which to fetch the data.
	private int endRowNo = -1;

	// This member variable specifies the type of operation(like select,insert,update,delete,etc.,)
	// Refer the DatabaseConstants for the list of operations
	private int operation;

	// This member variable has the operation extension as defined by the application.
	private String operationExtension = "";

	// This member variable is a collection containg the "where" clause filters
	@SuppressWarnings("rawtypes")
	private Map queryFilters = new HashMap();

	// This member variable holds the fields to be passed to the db operation
	@SuppressWarnings("rawtypes")
	private Map data = new HashMap();

	// This member variable contains the multiple rows of records to be passed to the db operation
	@SuppressWarnings("rawtypes")
	private List batchData = new ArrayList();

	// This member variable specifies the DatabaseAccess implementation to be used
	private String dbAccessImp;

	// This member variable contains the DataAccessMapKey for the selection of sql element
	private String dataAccessMapKey;

	// This member variable contains the DataSource
	private String dataSource;

	// This member variable is the reference of DataBaseResult
	private DatabaseResult resultObject;

	// The database access manager for this database request
	private DatabaseAccessManager dam;

	/**
	 * This enables the ibatis to queryasMap instead of list with keyProperty as the key valueProperty as the value of
	 * the key
	 **/
	// This member variable to say whether the query to done as map
	private boolean queryAsMap = false;

	// This member variable for the key property when the query is done as map
	private String keyProperty;

	// This member variable for the value property when the query is done as map
	private String valueProperty;

	/**
	 * This method sets the string of columns as keys
	 * 
	 * @param keyProperty String of columns for keyProperty
	 */
	public void setKeyProperty(String keyProperty)
	{
		this.keyProperty = keyProperty;
	}

	/**
	 * This method returns the value of the keyproperty as string
	 * 
	 * @return keyProperty keyProperty
	 */
	public String getKeyProperty()
	{
		return keyProperty;
	}

	/**
	 * This method returns the values of the keys
	 * 
	 * @return valueProperty the valueProperty
	 */
	public String getValueProperty()
	{
		return valueProperty;
	}

	/**
	 * This method sets the values for the keys as string
	 * 
	 * @param valueProperty string of the the values
	 */
	public void setValueProperty(String valueProperty)
	{
		this.valueProperty = valueProperty;
	}

	/**
	 * This method returns the value of the flag isQueryasMap
	 * 
	 * @return queryAsMap if queryAsMap returns, true else false
	 */
	public boolean isQueryAsMap()
	{
		return queryAsMap;
	}

	/**
	 * This method sets the value of the flag isQueryasMap
	 * 
	 * @param queryAsMap the queryAsMap to set
	 */
	public void setQueryAsMap(boolean queryAsMap)
	{
		this.queryAsMap = queryAsMap;
	}

	/**
	 * This member variable is the instance for Logger
	 */
	private static final Logger dbLogger = Logger.getLogger(DatabaseRequest.class);
}