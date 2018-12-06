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

import java.util.Map;

/**
 * This IDatabaseAccess class is an abstract class which implements the various database operations. The default
 * implementation is provided with based on iBATIS IBatisDatabaseAccess. To add a new DB access methods like JDBC or
 * hibernate, make an appropriate entry in the DatabaseAccessFactory class and DatabaseConstants class.
 * 
 * @version 1.0
 */
public interface IDatabaseAccess
{
	/**
	 * Abstracts the "SELECT" operation and returns the selected rows as object
	 * 
	 * 
	 * @param dbReq object holding the request details like SELECT statement, fileters, pagination values
	 * @return DatabaseResult, object holding the number of rows affected information
	 * @throws DatabaseException SQLException occurs
	 */
	public DatabaseResult select(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * Abstracts the "INSERT" db operation. Inserts a single row in the database. @param dbReq DatabaseRequest object
	 * holding the request details like data to be submited @return DatabaseResult object, this object will typically
	 * not be of use for this operation It would typically be a empty databaseresult object @throws DatabaseException if
	 * any SQLException occurs
	 * 
	 * @param dbReq object details like data to be submited
	 * @return DatabaseResult object holds the number of rows affected information
	 * @throws DatabaseException any SQLException
	 */
	public DatabaseResult insert(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * Abstracts the "UPDATE" db operation. Updates the data for the selected row(s) in the db
	 * 
	 * @param dbReq object holding the request details like data to be submited
	 * @return DatabaseResult object, holds the number of rows affected information
	 * @throws DatabaseException any SQLException
	 */
	public DatabaseResult update(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * Abstracts the "DELETE" db operation. Deletes the selected row(s) and returns the number of rows affected by the
	 * operation
	 * 
	 * @param dbReq object holding the request details like data
	 * @return DatabaseResult object holding the number of rows affected
	 * @throws DatabaseException any SQLException
	 */
	public DatabaseResult delete(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * Abstracts the "BATCH INSERT" db operaton. Inserts the batch of records While setting DatabaseRequest, 1)Set the
	 * operation to batch insert 2)Call the DatabaseRequest.addDataToBatch() passing the fileds value as HashMap for the
	 * rows to be inserted
	 * 
	 * @param dbReq DatabaseRequest object holding the request details
	 * @return DatabaseResult object holding the number of rows affected information
	 * @throws DatabaseException if any SQLException occurs
	 */
	public DatabaseResult batchInsert(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * Abstracts the "BATCH UPDATE" db operaton. This API updates the batch of records The user has to do the following
	 * steps besides the basic DatabaseRequest setting, 1)set the operation to batch update 2)call the
	 * DatabaseRequest.addDataToBatch() passing the fileds value for the update query as HashMap, for row to be updated
	 * 
	 * @param dbReq DatabaseRequest object holding the request details like data to be submited
	 * @return DatabaseResult object, holds the number of rows affected information
	 * @throws DatabaseException if any SQLException occurs
	 */
	public DatabaseResult batchUpdate(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * Abstracts the Stored Procedure execute operation. There are two aspects to stored procedure, the parameters and
	 * their mode( in, out, inout) and the return type. The parameters are passed like the way they are passed to a
	 * insert statement, i.e use DatabaseRequest.setData api The mode for each param is defined in the sqlmap xml file.
	 * 
	 * The procedureid used in the sqlmap file should be prefixed with the appropriate key For example, if the stored
	 * procedure is EXECUTE_SP_ONLY_RETURN_NO_OUT, the procedure id will be
	 * "EXECUTE_SP_ONLY_RETURN_NO_OUT_<YOUR APP SPECIFIC ID HERE>" The <YOUR APP SPECIFIC ID HERE> is the one which will
	 * be used as the DamKey in the database request object. There are 4 variants of the Stored Procedure based on how
	 * they return values to the caller:
	 * 
	 * EXECUTE_SP_ONLY_RETURN_NO_OUT : one that accepts no params (or) only "in" params and returns a list of rows The
	 * DatabaseResult.returnList will be a list of rows
	 * 
	 * EXECUTE_SP_NO_RETURN_NO_OUT : one that accepts no params (or) only "in" params but does not return a list of rows
	 * The DatabaseResult.returnList is irrelevant in this case
	 * 
	 * EXECUTE_SP_NO_RETURN_ONLY_OUT : one that accepts "out" (or/and) "inout" params with zero or more "in" params but
	 * does not return a list of rows The DatabaseResult.returnList will have only 1 value which will be a Map whose key
	 * will be the out or inout parameter name and the value will be the storeproc results
	 * 
	 * EXECUTE_SP_RETURN_AND_OUT : one that accepts "out" (or/and) "inout" params with zero or more "in" params and
	 * returns a list of rows The first element in the databaseResult.returnList will have the storedproc out parameters
	 * and the 2nd element will have the storedprocedure's result.
	 * 
	 * @return DatabaseResult object containing the result of the stored procedure execution
	 * @throws DatabaseException if any SQLException occurs
	 */
	public DatabaseResult executeStoreProcedure(DatabaseRequest dbReq) throws DatabaseException;

	/**
	 * This is invoked as part of the Canvas initialization sequence to ask the Database access to prepare the logical
	 * data sources that it needs to use based on the configuration
	 * 
	 * @return The index of all the logical data sources and their implementations
	 * @throws DatabaseException Thrown if any error occurs while initializing the data sources.
	 */
	public Map<String, Object> prepareDataSources() throws DatabaseException;

	/**
	 * This is invoked as part of the configuration initialization sequence. This has to ensure that the implementation
	 * does not impact any current queries getting executed, but subsequent queries should shift over to the new data
	 * sources
	 * 
	 * @param allDataSources The list of all data sources that have been initialized (based on the earlier call to
	 *            prepareDataSources()
	 * @throws DatabaseException Thrown if there are any errors while trying to apply the updated data sources.
	 */
	public void initializeWith(Map<String, Object> allDataSources) throws DatabaseException;

	/**
	 * This method is expected to return the current status of the database access layer
	 * 
	 * @return The Initialization status of the database access layer
	 */
	public InitializationStatus getStatus();

	/**
	 * This method will be invoked to update the initialization status.
	 * 
	 * @param status The initialization status to update.
	 */
	public void setStatus(InitializationStatus status);

	/**
	 * This is a simple enumeration of the initialization status of this database access.
	 */
	public static enum InitializationStatus
	{
		NOT_INITIALIZED, INITIALIZED, INITIALIZATION_FAILURE
	}

}
