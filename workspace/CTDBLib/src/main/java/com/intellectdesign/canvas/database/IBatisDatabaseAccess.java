/*******************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 ******************************************************************************/

package com.intellectdesign.canvas.database;

import java.io.IOException;
import java.io.Reader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.ibatis.common.logging.LogFactory;
import com.ibatis.common.resources.Resources;
import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapClientBuilder;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.DBConfigurationDescriptor;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class provides the IBATIS flavor to the IDatabaseAccess interface. Use this class to select, update, delete,
 * insert, batch Insert, batchUpdate or to execute the stored procedures
 * 
 * @version 1.0
 */
public class IBatisDatabaseAccess implements IDatabaseAccess
{
	/**
	 * Initializes the sqlMapConfigCollection and sets the logging implementation to Log4J
	 */
	static
	{
		/**
		 * The initialization of logger
		 */
		IBLogger = Logger.getLogger(IBatisDatabaseAccess.class);
		LogFactory.selectLog4JLogging();
	}

	/**
	 * This method is expected to return the current status of the database access layer
	 * 
	 * @return The Initialization status of the database access layer
	 */
	@Override
	public InitializationStatus getStatus()
	{
		return mInitStatus;
	}

	/**
	 * update the initialization status
	 * 
	 * @param status The status to be updated
	 * @see com.intellectdesign.canvas.database.IDatabaseAccess#setStatus(com.intellectdesign.canvas.database.IDatabaseAccess.InitializationStatus)
	 */
	@Override
	public void setStatus(InitializationStatus status)
	{
		mInitStatus = status;
	}

	/**
	 * This is invoked as part of the configuration initialization sequence. This has to ensure that the implementation
	 * does not impact any current queries getting executed, but subsequent queries should shift over to the new data
	 * sources
	 * 
	 * @param allDataSources The list of all data sources that have been initialized (based on the earlier call to
	 *            prepareDataSources()
	 * @throws DatabaseException Thrown if there are any errors while trying to apply the updated data sources.
	 */
	@Override
	public synchronized void initializeWith(Map<String, Object> allDataSources) throws DatabaseException
	{
		sqlMapConfigCollection = allDataSources;
		mInitStatus = InitializationStatus.INITIALIZED;
		IBLogger.ctinfo("CTDBL00055");
	}

	/**
	 * This is triggered as part of the Canvas Initialization sequence. Here we prepare the list of logical data sources
	 * and try to initialize the
	 * 
	 * @return
	 * @throws DatabaseException
	 * @see com.intellectdesign.canvas.database.IDatabaseAccess#prepareDataSources()
	 */
	@Override
	public Map<String, Object> prepareDataSources() throws DatabaseException
	{
		Map<String, Object> allDataSources = new HashMap<String, Object>();
		IBLogger.ctinfo("CTDBL00063");

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		DBConfigurationDescriptor dbDescriptor = configMgr.getDBDescriptor();

		HashMap<String, String> datasourceMap = new HashMap<String, String>();
		datasourceMap.putAll(dbDescriptor.getCtImplIBATISDSMap());
		datasourceMap.put(dbDescriptor.getCtFWIBATISDSKey(), CTProperties.getProperty("CT_DSXML"));

		Iterator<String> it = datasourceMap.keySet().iterator();
		// Step 1: Load the configured data sources
		while (it.hasNext())
		{
			String dbKey = it.next();
			String sqlMapFilePath = datasourceMap.get(dbKey);
			if (!StringUtils.isEmpty(sqlMapFilePath))
			{
				try
				{
					IBLogger.ctdebug("CTDBL00064", dbKey, sqlMapFilePath);
					SqlMapClient sqlMapClientOne = createSqlMap(sqlMapFilePath);

					IBLogger.ctdebug("CTDBL00066", sqlMapClientOne);
					// adding an entry for the external data source
					// The Datasource JNDI key entry in the SQL Map config file should
					// be identical to the value of the 'dbKey'
					if (allDataSources.containsKey(dbKey))
					{
						IBLogger.cterror("CTDBL00067");
						IBLogger.cterror("CTDBL00068", dbKey);
						throw new DatabaseException(
								"Duplicate Datasource key definied for the list of datasources for ibatis.");
					}
					allDataSources.put(dbKey, sqlMapClientOne);
				} catch (DatabaseException e)
				{
					IBLogger.cterror("CTDBL00070", e);
					throw e;
				} catch (Throwable aThrowable)// the exception is not thrown back intentionally, this will allow
				// the application to work with the datasources that are initialized correctly
				{
					IBLogger.cterror("CTDBL00070", aThrowable);
					throw new DatabaseException("Error while initializing Data source '" + dbKey + "'", aThrowable);
				}
			} else
			{
				IBLogger.ctwarn("CTDBL00071", dbKey);
			}
		}
		IBLogger.ctinfo("CTDBL00072");

		// Step 2: Identify the default data source and tag it under the predefined key - DEFAULT.
		String defaultDataSourceKey = dbDescriptor.getCtDefaultiBatisDSKey();
		if (StringUtils.isEmpty(defaultDataSourceKey))
		{
			IBLogger.cterror("CTDBL00058");
			throw new DatabaseException(
					"A default datasource key is not found. A default datasource must be specified.");
		}
		if (allDataSources.containsKey(defaultDataSourceKey))
		{
			if (allDataSources.containsKey(DatabaseConstants.DEFAULT_DATASOURCE))
			{
				IBLogger.cterror("CTDBL00059", DatabaseConstants.DEFAULT_DATASOURCE);
				throw new DatabaseException(
						"The datasource key "
								+ DatabaseConstants.DEFAULT_DATASOURCE
								+ " is a reserved key and is used internally to map the default datasource. Please use a different datasource key and mention that as the default.");
			}
			// mapping the ibatis config object to the default datasource key used by the Database request
			// object.
			IBLogger.ctinfo("CTDBL00060", defaultDataSourceKey);
			allDataSources.put(DatabaseConstants.DEFAULT_DATASOURCE, allDataSources.get(defaultDataSourceKey));
		} else
		{
			IBLogger.cterror("CTDBL00061", defaultDataSourceKey);
			throw new DatabaseException(
					"The default datasource key "
							+ defaultDataSourceKey
							+ " is incorrect.  There are no Ibatis datasoruce keys configured against this.  Please check the property file for the correct value.");

		}
		IBLogger.ctinfo("CTDBL00062");

		return allDataSources;
	}

	/**
	 * This method implements the "SELECT" operation defined in the
	 * com.intellectdesign.canvas.constants.database.IDataBaseAccess interface. The method executes the Select operation
	 * for the parameters passed as databaserequest and returns the database result as sqlMap or arraylist based on the
	 * isQueryAsMapI flag value
	 * 
	 * 
	 * @see com.intellectdesign.canvas.constants.database.IDataBaseAccess
	 * 
	 * @param dbRequest object of holding all of the values set by client
	 * @return dbResult resultset containing the list of rows for select operation
	 * @throws DatabaseException any sqlexception is wrapped as a DatabaseException and thrown back to the client
	 * @exception DatabaseException SQLException occurred while executing the select operation
	 * @exception RuntimeException runtime exception occurred while executing the select operation
	 */
	@SuppressWarnings("rawtypes")
	public DatabaseResult select(DatabaseRequest dbRequest) throws DatabaseException
	{
		checkInitializationStatus();
		try
		{
			IBLogger.ctinfo("CTDBL00074");

			IBLogger.ctdebug("CTDBL00075", dbRequest.getDataSource());
			SqlMapClient sqlMap = getSqlMapInstance(dbRequest.getDataSource());
			DatabaseResult dbResult = new DatabaseResult();

			List rowsReturned = null;
			Map rowsReturnedMap = null;

			if (dbRequest.isQueryAsMap())
			{

				IBLogger.ctdebug("CTDBL00076", dbRequest.getKeyProperty(), dbRequest.getValueProperty());

				rowsReturnedMap = sqlMap.queryForMap(generateMapKey(dbRequest, OPERATION_SELECT),
						dbRequest.getFilters(), dbRequest.getKeyProperty(), dbRequest.getValueProperty());

				IBLogger.ctdebug("CTDBL00077");

				IBLogger.ctdebug("CTDBL00078");

				/* If the query returns empty then empty hasmap is set in the result object */

				if (rowsReturnedMap == null)
					rowsReturnedMap = new HashMap();
				dbResult.setReturnedMap(rowsReturnedMap);

				IBLogger.ctinfo("CTDBL00079");

				return dbResult;

			} else if (dbRequest.isValidStartAndEndRowNos())
			{
				IBLogger.ctdebug("CTDBL00080");
				int skip = dbRequest.getStartRowNo() - 1;
				int end = dbRequest.getEndRowNo();
				int maxRowsToRetrieve = end - skip;
				IBLogger.ctdebug("CTDBL00081", skip, maxRowsToRetrieve);
				IBLogger.ctdebug("CTDBL00082");
				rowsReturned = sqlMap.queryForList(generateMapKey(dbRequest, OPERATION_SELECT), dbRequest.getFilters(),
						skip, maxRowsToRetrieve);
				IBLogger.ctdebug("CTDBL00083");
			} else
			{
				IBLogger.ctdebug("CTDBL00084");
				rowsReturned = sqlMap.queryForList(generateMapKey(dbRequest, OPERATION_SELECT), dbRequest.getFilters());
				IBLogger.ctdebug("CTDBL00085");
			}

			IBLogger.ctdebug("CTDBL00086");

			if (rowsReturned == null)
				rowsReturned = new ArrayList();
			dbResult.setReturnedList(rowsReturned);

			IBLogger.ctinfo("CTDBL00087");

			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00088", anSqlException);
			throw new DatabaseException("An SQLException occurred while executing the select operation", anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00089", aThrowable);
			throw new RuntimeException("A runtime exception occurred while executing the select operation", aThrowable);
		}
	}

	/**
	 * This method implements the INSERT operation defined in the
	 * com.intellectdesign.canvas.constants.database.IDataBaseAccess interface.
	 * 
	 * The method executes the INSERT operation for the dbRequest and returns the number of rows affected. The operation
	 * and the operation extension are used to identify the ibatismapkey
	 * 
	 * @see com.intellectdesign.canvas.constants.database.IDataBaseAccess#insert(com.intellectdesign.canvas.constants.database.DataBaseRequest)
	 * 
	 * @param dbRequest DatabaseRequest object of holding all of the values set by client
	 * @return dbResult DatabaseResult object after executing the dbrequest
	 * @throws DatabaseException Exception occured while executing insert operation
	 * @exception RuntimeException
	 */
	public DatabaseResult insert(DatabaseRequest dbRequest) throws DatabaseException
	{
		checkInitializationStatus();
		try
		{
			IBLogger.ctinfo("CTDBL00090");

			IBLogger.ctdebug("CTDBL00091", dbRequest.getDataSource());
			SqlMapClient sqlMap = getSqlMapInstance(dbRequest.getDataSource());

			IBLogger.ctdebug("CTDBL00092");
			sqlMap.insert(generateMapKey(dbRequest, OPERATION_INSERT), dbRequest.getData());
			IBLogger.ctdebug("CTDBL00093");

			IBLogger.ctdebug("CTDBL00094");
			DatabaseResult dbResult = new DatabaseResult();

			IBLogger.ctinfo("CTDBL00095");

			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00096", anSqlException);
			throw new DatabaseException("An SQLException occurred while executing the insert operation", anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00097", aThrowable);
			throw new RuntimeException("A runtime exception occurred while executing the insert operation", aThrowable);
		}
	}

	/**
	 * This method implements the batchInsert() operation defined in
	 * com.intellectdesign.canvas.constants.database.IDataBaseAccess
	 * 
	 * The method executes the multi-rows INSERT operation for the dbRequest and returns the number of rows affected.
	 * The operation and the operation extension are used to identify the ibatismapkey
	 * 
	 * Note: 1)it is entirely legal for the JDBC driver to fail to return the number of records updated in a batch when
	 * failing to executeBatch(), the method will return 0 in spite of inserting some of the records. The Oracle driver
	 * always behaves in this way.
	 * 
	 * 2)The batch insert operation is supported only for each transaction (ie, use startTransaction(),
	 * commitTransaction() and endTransaction() as a sequel) If you fail to do so, a new transaction will be started for
	 * each statement, and performance will suffer as the batch size grows.
	 * 
	 * 
	 * @param dbRequest DatabaseRequest object of holding all of the values set by client
	 * @return dbResult DatabaseResult object, which contains the no of rows affected
	 * @throws DatabaseException Exception occured while executing batch insert operation
	 * @exception RuntimeException
	 */
	@SuppressWarnings("rawtypes")
	public DatabaseResult batchInsert(DatabaseRequest dbRequest) throws DatabaseException
	{
		SqlMapClient sqlMap = null;
		checkInitializationStatus();
		try
		{
			IBLogger.ctinfo("CTDBL00098");
			String iBATISMapKey = generateMapKey(dbRequest, OPERATION_BATCH_INSERT);
			IBLogger.ctdebug("CTDBL00099", dbRequest.getDataSource());
			sqlMap = getSqlMapInstance(dbRequest.getDataSource());
			sqlMap.startTransaction();
			IBLogger.ctdebug("CTDBL00100");
			sqlMap.startBatch();
			// Getting the batch size
			int batchSize = dbRequest.getBatchData().size();
			HashMap fields;
			int index;
			for (index = 0; index < batchSize; index++)
			{

				fields = (HashMap) ((dbRequest.getBatchData()).get(index));
				IBLogger.ctdebug("CTDBL00101", fields);
				sqlMap.insert(iBATISMapKey, fields);
			}

			IBLogger.ctdebug("CTDBL00102");
			DatabaseResult dbResult = new DatabaseResult();
			int affectedRows = sqlMap.executeBatch();
			sqlMap.commitTransaction();
			IBLogger.ctdebug("CTDBL00103", affectedRows);
			dbResult.setNoOfRowsAffected(affectedRows);
			IBLogger.ctinfo("CTDBL00104");
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00105", anSqlException);
			throw new DatabaseException("An SQLException occurred while executing the Batch Insert operation",
					anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00106", aThrowable);
			throw new RuntimeException("A runtime exception occurred while executing the Batch Insert operation",
					aThrowable);
		} finally
		{
			if (sqlMap != null)
			{
				try
				{
					sqlMap.endTransaction();
				} catch (SQLException exception)
				{
					IBLogger.cterror("CTDBL00107", exception);
					throw new DatabaseException("An SQLException occurred while performing the Batch Insert operation",
							exception);
				}
			}
		}
	}

	/**
	 * This method implements the batchUpdate() operation defined in
	 * com.intellectdesign.canvas.constants.database.IDataBaseAccess
	 * 
	 * The method executes the multi-rows UPDATE operation for the dbRequest and returns the number of rows affecfted.
	 * The operation and the operation extension are used to identify the ibatismapkey.
	 * 
	 * Note: 1)it is entirely legal for the JDBC driver to fail to return the number of records updated in a batch when
	 * failing to executeBatch(), the method will return 0 in spite of updating some of the records. The Oracle driver
	 * always behaves in this way.
	 * 
	 * 2)The batch update operation is done as sequel transaction statements (ie, use startTransaction(),
	 * commitTransaction() and endTransaction()) If you fail to do so, a new transaction will be started for each
	 * statement; hence, performance will suffer as the batch size grows.
	 * 
	 * 
	 * @param dbRequest DatabaseRequest object of holding all of the values set by client
	 * @return dbResult DatabaseResult object, which contains the no of rows affected
	 * @throws DatabaseException Exception occured while executing batch update operation
	 * @exception RuntimeException
	 */
	@SuppressWarnings("rawtypes")
	public DatabaseResult batchUpdate(DatabaseRequest dbRequest) throws DatabaseException
	{
		SqlMapClient sqlMap = null;
		checkInitializationStatus();
		try
		{
			IBLogger.ctinfo("CTDBL00108");
			String iBATISMapKey = generateMapKey(dbRequest, OPERATION_BATCH_UPDATE);
			IBLogger.ctdebug("CTDBL00109", dbRequest.getDataSource());
			sqlMap = getSqlMapInstance(dbRequest.getDataSource());
			IBLogger.ctdebug("CTDBL00110");
			sqlMap.startTransaction();
			sqlMap.startBatch();
			// Getting the batch size
			int batchSize = dbRequest.getBatchData().size();
			HashMap fields;
			int index;
			for (index = 0; index < batchSize; index++)
			{

				fields = (HashMap) ((dbRequest.getBatchData()).get(index));
				IBLogger.ctdebug("CTDBL00111", fields);
				sqlMap.update(iBATISMapKey, fields);
			}

			IBLogger.ctdebug("CTDBL00112");
			DatabaseResult dbResult = new DatabaseResult();
			int affectedRows = sqlMap.executeBatch();
			sqlMap.commitTransaction();
			IBLogger.ctdebug("CTDBL00113", affectedRows);
			dbResult.setNoOfRowsAffected(affectedRows);
			IBLogger.ctinfo("CTDBL00114");
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00115", anSqlException);
			throw new DatabaseException("An SQLException occurred while executing the Batch update operation",
					anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00116", aThrowable);
			throw new RuntimeException("A runtime exception occurred while executing the Batch update operation",
					aThrowable);
		} finally
		{
			if (sqlMap != null)
			{
				try
				{
					sqlMap.endTransaction();
				} catch (SQLException exception)
				{
					IBLogger.cterror("CTDBL00117", exception);
					throw new DatabaseException("An SQLException occurred while performing the Batch update operation",
							exception);
				}
			}
		}
	}

	/**
	 * This method implements the update operation defined in the
	 * com.intellectdesign.canvas.constants.database.IDataBaseAccess interface.
	 * 
	 * The method executes the UPDATE operation for the dbRequest. The operation and the operation extension are used to
	 * identify the ibatismapkey
	 * 
	 * @see com.intellectdesign.canvas.constants.database.IDataBaseAccess#insert(com.intellectdesign.canvas.constants.database.DataBaseRequest)
	 * 
	 * @param dbRequest DatabaseRequest object of holding all of the values set by client
	 * @return dbResult DatabaseResult object after executing the dbrequest
	 * @throws DatabaseException Exception occured while executing update operation
	 * @exception RuntimeException
	 * 
	 */
	@SuppressWarnings("rawtypes")
	public DatabaseResult update(DatabaseRequest dbRequest) throws DatabaseException
	{
		checkInitializationStatus();
		try
		{
			IBLogger.ctinfo("CTDBL00118");

			IBLogger.ctdebug("CTDBL00119", dbRequest.getDataSource());
			SqlMapClient sqlMap = getSqlMapInstance(dbRequest.getDataSource());

			// merge the data and filters before sending to iBATIS update
			IBLogger.ctdebug("CTDBL00120");
			Map updateMap = mergeDataAndFilterMaps(dbRequest.getData(), dbRequest.getFilters());
			IBLogger.ctdebug("CTDBL00121");

			IBLogger.ctdebug("CTDBL00122");
			int noOfRowsaffected = sqlMap.update(generateMapKey(dbRequest, OPERATION_UPDATE), updateMap);
			IBLogger.ctdebug("CTDBL00123");

			IBLogger.ctdebug("CTDBL00124");
			DatabaseResult dbResult = new DatabaseResult();
			dbResult.setNoOfRowsAffected(noOfRowsaffected);

			IBLogger.ctinfo("CTDBL00125");
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00126", anSqlException);
			throw new DatabaseException("An SQLException occurred while executing the update operation", anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00127", aThrowable);
			throw new RuntimeException("A runtime exception occurred while executing the update operation", aThrowable);
		}
	}

	/**
	 * This method implements the implementation executing the Stored Procedure db operation using IBATIS. All inputs to
	 * the stored procedure are via the "Data" property in the dbRequest object.
	 * 
	 * Stored Procedure are of 4 variants, which are primarily based on how they return values to the caller:
	 * 
	 * EXECUTE_SP_ONLY_RETURN_NO_OUT : accepts no params (or) only "in" params and returns a list of rows -> currently
	 * supported in this version of IBATISDatabaseAccess. The DatabaseResult.returnList will be a list of rows
	 * 
	 * EXECUTE_SP_NO_RETURN_NO_OUT : accepts no params (or) only "in" params but does not return a list of rows The
	 * DatabaseResult.returnList is irrelevant in this case
	 * 
	 * EXECUTE_SP_NO_RETURN_ONLY_OUT: accepts "out" (or/and) "inout" params with zero or more "in" params but does not
	 * return a list of rows The DatabaseResult.returnList will have only 1 value of mapping whose key will be the out
	 * or inout parameter name and the value will be the SP results
	 * 
	 * EXECUTE_SP_RETURN_AND_OUT : accepts "out" (or/and) "inout" params with zero or more "in" params and returns a
	 * list of rows The last element in the DatabaseResult.returnList will have mapping which has the results of the out
	 * (or/and) inout params and the 0th to the last-1 elements will be the result set returned by stored procedure
	 * 
	 * @param dbReq
	 * @return DatabaseResult object containing the result of the stored procedure execution
	 * @throws DatabaseException if any SQLException occurs
	 */
	public DatabaseResult executeStoreProcedure(DatabaseRequest dbReq) throws DatabaseException
	{
		IBLogger.ctinfo("CTDBL00128");
		checkInitializationStatus();
		DatabaseResult dbResult = new DatabaseResult();
		int operationToPerform = dbReq.getOperation();

		switch (operationToPerform)
		// delegating to the appropriate type of stored procedures
		{
		case (DatabaseConstants.EXECUTE_SP_ONLY_RETURN_NO_OUT):
			dbResult = executeStoreProcedureOnlyReturnNoOut(dbReq);
			break;
		case (DatabaseConstants.EXECUTE_SP_NO_RETURN_NO_OUT):
			dbResult = executeStoreProcedureNoReturnNoOut(dbReq);
			break;
		case (DatabaseConstants.EXECUTE_SP_NO_RETURN_ONLY_OUT):
			dbResult = executeStoreProcedureNoReturnOnlyOut(dbReq);
			break;
		case (DatabaseConstants.EXECUTE_SP_RETURN_AND_OUT):
			dbResult = executeStoreProcedureReturnAndOut(dbReq);
			break;
		}
		IBLogger.ctinfo("CTDBL00129");
		return dbResult;
	}

	/**
	 * This method implements the stored procedure type EXECUTE_SP_ONLY_RETURN_NO_OUT i.e accepts no params (or) only
	 * "in" params and returns a list of rows
	 * 
	 * @param dbRequest dbRequest for the EXECUTE_SP_ONLY_RETURN_NO_OUT execution
	 * @return dbResult DatabaseResult object containing the list of rows returned by the stored procedure after
	 *         execution
	 * @throws DatabaseException if any SQLException occurs
	 */
	@SuppressWarnings(
	{ "rawtypes" })
	private DatabaseResult executeStoreProcedureOnlyReturnNoOut(DatabaseRequest dbRequest) throws DatabaseException
	{
		try
		{
			IBLogger.ctinfo("CTDBL00130", OPERATION_EXECUTE_SP_ONLY_RETURN_NO_OUT);
			IBLogger.ctdebug("CTDBL00131", dbRequest.getDataSource());
			SqlMapClient sqlMap = getSqlMapInstance(dbRequest.getDataSource());

			List rowsReturned = null;

			IBLogger.ctdebug("CTDBL00132");
			rowsReturned = sqlMap.queryForList(generateMapKey(dbRequest, OPERATION_EXECUTE_SP_ONLY_RETURN_NO_OUT),
					dbRequest.getData());
			IBLogger.ctdebug("CTDBL00133");

			IBLogger.ctdebug("CTDBL00134");
			DatabaseResult dbResult = new DatabaseResult();
			if (rowsReturned == null)
				rowsReturned = new ArrayList();
			dbResult.setReturnedList(rowsReturned);

			IBLogger.ctinfo("CTDBL00135", OPERATION_EXECUTE_SP_ONLY_RETURN_NO_OUT);
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00136", anSqlException);
			throw new DatabaseException(
					"An SQLException occurred while executing the executeStoreProcedureOnlyReturnNoOut operation",
					anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00137", aThrowable);
			throw new RuntimeException(
					"A runtime exception occurred while executing the executeStoreProcedureOnlyReturnNoOut operation",
					aThrowable);
		}
	}

	/**
	 * This method implements the stored procedure type EXECUTE_SP_NO_RETURN_ONLY_OUT i.e accepts zero or more "in"
	 * params and also one or more "out" or "inout" parameters. The sqlmap.update method is used for executing the
	 * stored procedure.
	 * 
	 * @param dbRequest The dbRequest for the EXECUTE_SP_NO_RETURN_ONLY_OUT execution
	 * @return DatabaseResult object containing a list with one object which is 'Map' object that was used for sending
	 *         in parameters. This map object will be updated with the stored procedure results. the key that would have
	 *         the results is the same that would have been defined in the parameter map of the sqlmap file as "out" or
	 *         "inout" parameters
	 * 
	 *         Note: Since A copy of the "data" available in the request object is what is sent as parameters, the
	 *         results will only be available in this DatabaseResult object.
	 * @throws DatabaseException if any SQLException occurs
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	private DatabaseResult executeStoreProcedureNoReturnOnlyOut(DatabaseRequest dbRequest) throws DatabaseException
	{
		SqlMapClient sqlMap = null;
		Boolean transactionFlag = false;
		try
		{
			IBLogger.ctinfo("CTDBL00138", OPERATION_EXECUTE_SP_NO_RETURN_ONLY_OUT);
			IBLogger.ctdebug("CTDBL00139", dbRequest.getDataSource());
			sqlMap = getSqlMapInstance(dbRequest.getDataSource());

			// if global temporary table is used to fetch data while executing Stored Procedure,
			// autocommit should be set to false explicitly before calling stored procedure
			// To set autocommit to false,get the current connection.
			// For getting the current connection, transaction need to be started. So making explicit call to
			// startTransaction() of SqlMapClient.
			// For Reference please read the below url
			// http://www.orafaq.com/forum/t/28453/0/
			if (sqlMap.getCurrentConnection() == null)
			{
				sqlMap.startTransaction();
				// Flag to be used in finally block to identify whether transaction is started
				transactionFlag = true;
			}
			sqlMap.getCurrentConnection().setAutoCommit(false);
			List rowsReturned = new ArrayList();
			// taking a copy of the Map params since the sqlmap storeprocedure api will update the Map object for
			// returning results
			Map storedProcParams = new HashMap(dbRequest.getData());
			IBLogger.ctdebug("CTDBL00140");

			sqlMap.update(generateMapKey(dbRequest, OPERATION_EXECUTE_SP_NO_RETURN_ONLY_OUT), storedProcParams);

			IBLogger.ctdebug("CTDBL00141");
			// the storeProcParams will have the outparams as defined in the stored procedure
			rowsReturned.add(storedProcParams);

			IBLogger.ctdebug("CTDBL00142");
			DatabaseResult dbResult = new DatabaseResult();
			dbResult.setReturnedList(rowsReturned);

			IBLogger.ctinfo("CTDBL00143", OPERATION_EXECUTE_SP_NO_RETURN_ONLY_OUT);
			// if stored procedure is using any operations like insert, delete and update, an explicit commit() should
			// be done on the current connection
			// while fetching data
			// For Reference please read the below url
			// http://www.orafaq.com/forum/t/28453/0/
			sqlMap.getCurrentConnection().commit();
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00144", anSqlException);
			throw new DatabaseException(
					"An SQLException occurred while executing the executeStoreProcedureNoReturnOnlyOut operation",
					anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00145", aThrowable);
			throw new RuntimeException(
					"A runtime exception occurred while executing the executeStoreProcedureNoReturnOnlyOut operation",
					aThrowable);
		} finally
		{
			try
			{
				// To set auto commit as true or false for reading data from temporary table, get the current
				// Connection.
				// To get the current Connection, the transaction need to be started.
				// If the Transaction already started, It should be ended.
				// So transactionFlag, a boolean variable is used to decide whether transaction is stared or not.
				if (sqlMap != null && (transactionFlag))
					sqlMap.endTransaction();
			} catch (SQLException sqlex)
			{
				IBLogger.cterror("CTDBL00146", sqlex);
			}
		}
	}

	/**
	 * This method is in Pending for implementation
	 * 
	 * @param dbReq
	 * @throws DatabaseException
	 */
	private DatabaseResult executeStoreProcedureNoReturnNoOut(DatabaseRequest dbReq) throws DatabaseException
	{
		throw new DatabaseException(
				"This version of IBATISDatabaseAccess has to be enhanced to support this type of StoreProcedure : "
						+ OPERATION_EXECUTE_SP_NO_RETURN_NO_OUT);
	}

	/**
	 * This method implements the stored procedure EXECUTE_SP_RETURN_AND_OUT i.e accepts "out" (or/and) "inout" params
	 * with zero or more "in" params and returns a list of rows. Use this method in the following cases Oracle Functions
	 * and Db2 Stored Proc that return results In case of Oracle Functions, the sql map file (which this method would
	 * call) should define an out parameter as defined in DatabaseConstants.DEFAULT_STOREDPROC_RETURN_KEY This is done
	 * so that the consumer of this api, which is the application, does not care whether it is db2 or oracle. they
	 * always have a consistent way of retrieving data from a storeproc or function that returns data and also as out
	 * paramters.
	 * 
	 * @param dbRequest The database request object
	 * @return DatabaseResult a databaseResult, The first element in the databaseResult will have the storedproc out
	 *         parameters and the 2nd element will have the storedprocedure's result.
	 * @throws DatabaseException any SQLException occurs
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	private DatabaseResult executeStoreProcedureReturnAndOut(DatabaseRequest dbRequest) throws DatabaseException
	{
		SqlMapClient sqlMap = null;
		boolean transactionFlag = false;
		try
		{
			IBLogger.ctinfo("CTDBL00147", OPERATION_EXECUTE_SP_RETURN_AND_OUT);
			IBLogger.ctdebug("CTDBL00148", dbRequest.getDataSource());
			sqlMap = getSqlMapInstance(dbRequest.getDataSource());

			transactionFlag = false;
			if (sqlMap.getCurrentConnection() == null)
			{
				sqlMap.startTransaction();
				// Flag to be used in finally block to identify whether transaction is started
				transactionFlag = true;
			}
			sqlMap.getCurrentConnection().setAutoCommit(false);
			List rowsReturned = new ArrayList();
			List spResult = null;
			// taking a copy of the Map params since the sqlmap storeprocedure api will update the Map object for
			// returning results
			Map storedProcParams = new HashMap(dbRequest.getData());
			IBLogger.ctdebug("CTDBL00149");
			spResult = sqlMap.queryForList(generateMapKey(dbRequest, OPERATION_EXECUTE_SP_RETURN_AND_OUT),
					storedProcParams);
			IBLogger.ctdebug("CTDBL00150");

			// the storeProcParams will have the outparams and the returned results as defined in the stored procedure
			rowsReturned.add(storedProcParams);
			if (spResult == null || spResult.isEmpty())
			{
				// assuming that the result set is probably inside the storedproc params
				if (storedProcParams.containsKey(DatabaseConstants.DEFAULT_STOREDPROC_RETURN_KEY))
				{
					Object result = storedProcParams.get(DatabaseConstants.DEFAULT_STOREDPROC_RETURN_KEY);
					rowsReturned.add(result);
				} else
				{
					// the else condition means that the consumer of this method is expecting a result from this Stored
					// Procedure or Function
					// but there is no ibatis sql map configuration that returned the result.
					// ideally this condition should never occur
					IBLogger.ctdebug("CTDBL00151", DatabaseConstants.DEFAULT_STOREDPROC_RETURN_KEY);
					// initializing an empty list in this case.
					rowsReturned.add(new ArrayList());
				}
			} else
			// the storedprocedure or function has indeed returned
			{
				rowsReturned.add(spResult);
			}

			IBLogger.ctdebug("CTDBL00152");
			DatabaseResult dbResult = new DatabaseResult();
			dbResult.setReturnedList(rowsReturned);

			sqlMap.getCurrentConnection().commit();
			IBLogger.ctinfo("CTDBL00153", OPERATION_EXECUTE_SP_RETURN_AND_OUT);
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00154", anSqlException);
			throw new DatabaseException(
					"An SQLException occurred while executing the executeStoreProcedureReturnAndOut operation",
					anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00155", aThrowable);
			throw new RuntimeException(
					"A runtime exception occurred while executing the executeStoreProcedureReturnAndOut operation",
					aThrowable);
		} finally
		{
			try
			{
				// To set auto commit as true or false for reading data from temporary table, get the current
				// Connection.
				// To get the current Connection, the transaction need to be started.
				// If the Transaction already started, It should be ended.
				// So transactionFlag, a boolean variable is used to decide whether transaction is stared or not.
				if (sqlMap != null && (transactionFlag))
					sqlMap.endTransaction();
			} catch (SQLException sqlex)
			{
				IBLogger.cterror("CTDBL00156", sqlex);
			}
		}
	}

	/**
	 * This method implements the DELETE operation defined in the
	 * com.intellectdesign.canvas.constants.database.IDataBaseAccess interface. The metod executes the DELETE operation
	 * for the dbRequests and returns the no of rows affected as object
	 * 
	 * @see com.intellectdesign.canvas.constants.database.IDataBaseAccess#delete(com.intellectdesign.canvas.constants.database.DataBaseRequest)
	 * @param dbRequest DBRequest object that contains the delete SQL
	 * @return dbResult
	 * @throws DatabaseException
	 */
	public DatabaseResult delete(DatabaseRequest dbRequest) throws DatabaseException
	{
		checkInitializationStatus();
		try
		{
			IBLogger.ctinfo("CTDBL00160");

			IBLogger.ctdebug("CTDBL00161", dbRequest.getDataSource());
			SqlMapClient sqlMap = getSqlMapInstance(dbRequest.getDataSource());

			IBLogger.ctdebug("CTDBL00162");
			int rowsaffected = sqlMap.delete(generateMapKey(dbRequest, OPERATION_DELETE), dbRequest.getFilters());
			IBLogger.ctdebug("CTDBL00163");

			IBLogger.ctdebug("CTDBL00164");
			DatabaseResult dbResult = new DatabaseResult();
			dbResult.setNoOfRowsAffected(rowsaffected);

			IBLogger.ctinfo("CTDBL00165");
			return dbResult;
		}
		// Wrap the SQLException as a DatabaseException
		catch (SQLException anSqlException)
		{
			IBLogger.cterror("CTDBL00166", anSqlException);
			throw new DatabaseException("An SQLException occurred while executing the delete operation", anSqlException);
		} catch (DatabaseException dbException)
		{
			throw dbException;
		}
		// Any non-sql-exception is thrown as a runtime exception
		catch (Throwable aThrowable)
		{
			IBLogger.cterror("CTDBL00167", aThrowable);
			throw new RuntimeException("A runtime exception occurred while executing the delete operation", aThrowable);
		}
	}

	/**
	 * This method merges the data and filter into one hashmap prefixing all filter keys with the value __FILTER__ This
	 * is to ensure that the filter keys dont override the datakeys while merging. Merging is necessary to send
	 * information to iBATIS layer The orginal data is not modifed by this method. A new hashmap is created instead.
	 * 
	 * @param data Mapping of data to be merged with
	 * @param filters Mapping of filter to be merged
	 * @return returnMap Mapped data with filters
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	private Map mergeDataAndFilterMaps(Map data, Map filters)
	{
		IBLogger.ctinfo("CTDBL00157");
		HashMap returnMap = new HashMap(data);
		Iterator filterIterator = filters.keySet().iterator();
		while (filterIterator.hasNext())
		{
			String filterKey = filterIterator.next().toString();
			String newFilterKey = FILTER_PREFIX + filterKey;
			returnMap.put(newFilterKey, filters.get(filterKey));
		}
		IBLogger.ctdebug("CTDBL00158");
		IBLogger.ctinfo("CTDBL00159");
		return returnMap;
	}

	/**
	 * Creates the complete ibatis access map key which is used to identify the sql from the mapfile to be executed
	 * 
	 * @param dbRequest a DatabaseRequest object
	 * @param operation String operation, the key which is to be appended.
	 * @return the fully constructed iBATISMapKey or just the iBATISMapKey as sent to this api
	 */
	private String generateMapKey(DatabaseRequest dbRequest, String operation)
	{
		String opEx = dbRequest.getOperationExtension();
		String aKey = dbRequest.getDataAccessMapKey() + IBATIS_NAMESPACE_TO_KEY_CONNECTOR + operation;
		String iBATISMapKey;
		if (opEx != null && !opEx.equals(""))
			iBATISMapKey = (aKey + IBATIS_OPERATION_TO_EXTENSION_CONNECTOR + opEx);
		else
			iBATISMapKey = aKey;
		IBLogger.ctdebug("CTDBL00168", iBATISMapKey);
		return iBATISMapKey;
	}

	/**
	 * Based on the parameter(location of the config file) passed a SqlMapClient instance is created and returned @param
	 * String resource that has the location of the config file @return SqlMapClient instance based on the resource
	 * passed @throws IOException in case of any IO exceptions
	 * 
	 * @param resource
	 * @return reader
	 * @throws IOException
	 */
	private static SqlMapClient createSqlMap(String resource) throws IOException
	{
		IBLogger.ctdebug("CTDBL00169", resource);

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		DBConfigurationDescriptor dbDescriptor = configMgr.getDBDescriptor();

		Reader reader = Resources.getResourceAsReader(resource);
		IBLogger.ctdebug("CTDBL00170");
		IBLogger.ctdebug("CTDBL00171", resource);
		Properties props = new Properties();
		props.put("CT_DATASOURCE", dbDescriptor.getCtFWIBATISDS());
		props.put("CT_DATABASE_VENDOR", dbDescriptor.getCtFWIBATISDSVendor());

		return SqlMapClientBuilder.buildSqlMapClient(reader, props);
	}

	/**
	 * This method retrieves the SqlMapClient instance from the sqlMapConfigCollection based on the key passed
	 * 
	 * @return SqlMapClient instance of SqlMapClient for the datasource
	 * @param dataSource name of the datasource
	 * @return sqlMapConfigCollection.get(dataSource)
	 * @throws DatabaseException Thrown if the dataSource provided is not a valid registered data source.
	 */
	private SqlMapClient getSqlMapInstance(String dataSource) throws DatabaseException
	{
		IBLogger.ctdebug("CTDBL00073", dataSource);
		SqlMapClient client = ((SqlMapClient) sqlMapConfigCollection.get(dataSource));

		if (client == null)
		{
			IBLogger.ctdebug("CTDBL00191", dataSource);
			// Check against the dynamic data source manager.
			DynamicDatasourceManager mgr = new DynamicDatasourceManager();
			client = mgr.getSqlMapInstanceFor(dataSource);
		}

		if (client == null)
			throw new DatabaseException("Data source provided '" + dataSource
					+ "' is not a valid data source. Please check the database configuration ");

		return client;
	}

	/**
	 * This method checks whether the data sources have been initialized. If the data sources have not been initialized,
	 * then it tries to forcibly initialize. If there was an initialization failure, then it will throw a canned
	 * exception
	 * 
	 * @throws DatabaseException Thrown if there is an initialization failure
	 */
	private void checkInitializationStatus() throws DatabaseException
	{
		switch (mInitStatus)
		{
		case INITIALIZED:
			return;
		case NOT_INITIALIZED:
			try
			{
				Map<String, Object> allDataSources = prepareDataSources();
				initializeWith(allDataSources);
			} catch (DatabaseException e)
			{
				mInitStatus = InitializationStatus.INITIALIZATION_FAILURE;
				throw e;
			}
			break;
		case INITIALIZATION_FAILURE:
			throw new DatabaseException(
					"The database access initialization has failed. Please check the database logs for the failure details");
		}
	}

	/**
	 * This member variable contains the operation select which should be mapped to the statement id in sqlmap file
	 */
	private final String OPERATION_SELECT = "SELECT";

	/**
	 * This member variable contains the operation insert which should be mapped to the statement id in sqlmap file
	 */
	private final String OPERATION_INSERT = "INSERT";

	/**
	 * This member variable contains the operation delete which should be mapped to the statement id in sqlmap file
	 */
	private final String OPERATION_DELETE = "DELETE";

	/**
	 * This member variable contains the operation update which should be mapped to the statement id in sqlmap file
	 */
	private final String OPERATION_UPDATE = "UPDATE";

	/**
	 * This member variable contains the operation Batch Insert which should be mapped to the statement id in the sqlmap
	 * file
	 */
	private final String OPERATION_BATCH_INSERT = "BATCH_INSERT";

	/**
	 * This member variable contains the operation Batch Update which should be mapped to the statement id in the sqlmap
	 * file
	 */
	private final String OPERATION_BATCH_UPDATE = "BATCH_UPDATE";

	/**
	 * A string representation database constant EXECUTE_SP_NO_RETURN_NO_OUT which should be mapped to the statement id
	 * in the sqlmap file
	 */
	private final String OPERATION_EXECUTE_SP_NO_RETURN_NO_OUT = "EXECUTE_SP_NO_RETURN_NO_OUT";

	/**
	 * A string representation database constant EXECUTE_SP_NO_RETURN_ONLY_OUT which should be mapped to the statement
	 * id in the sqlmap file
	 */
	private final String OPERATION_EXECUTE_SP_NO_RETURN_ONLY_OUT = "EXECUTE_SP_NO_RETURN_ONLY_OUT";

	/**
	 * A string representation database constant EXECUTE_SP_ONLY_RETURN_NO_OUT which should be mapped to the statement
	 * id in the sqlmap file
	 */
	private final String OPERATION_EXECUTE_SP_ONLY_RETURN_NO_OUT = "EXECUTE_SP_ONLY_RETURN_NO_OUT";

	/**
	 * A string representation database constant EXECUTE_SP_RETURN_AND_OUT which should be mapped to the statement id in
	 * the sqlmap file
	 */
	private final String OPERATION_EXECUTE_SP_RETURN_AND_OUT = "EXECUTE_SP_RETURN_AND_OUT";

	/**
	 * This member variable holdS the ibatis specific namespace to operation appender to identify a unique statement to
	 * execute.
	 */
	private final String IBATIS_NAMESPACE_TO_KEY_CONNECTOR = "_";

	/**
	 * This member variable hold the ibatis specific operation to operation extension to identify a unique statement to
	 * execute.
	 */

	private final String IBATIS_OPERATION_TO_EXTENSION_CONNECTOR = "_";

	/**
	 * This constant is prefixed with all filter keys in the database request.
	 */
	private final String FILTER_PREFIX = "__FILTER__";

	/**
	 * This member variable contains a collection of all the SqlMapClient instances
	 */
	@SuppressWarnings("rawtypes")
	private Map sqlMapConfigCollection;

	/**
	 * This is an instance of logger
	 */
	private static Logger IBLogger;

	private InitializationStatus mInitStatus = InitializationStatus.NOT_INITIALIZED;

}
