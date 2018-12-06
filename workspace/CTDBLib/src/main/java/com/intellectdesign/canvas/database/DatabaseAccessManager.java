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

import com.intellectdesign.canvas.logger.Logger;

/**
 * This DatabaseAccessManager class initializes the DatabaseAccessFactory and provides the resultset of records after
 * executing the Databserequest
 * 
 * @version 1.0
 */
public class DatabaseAccessManager
{

	/**
	 * This method delegates the database operation to the respective IDatabaseAccess methods based on the
	 * operations(select, insert...) requested in the dbrequest.
	 * 
	 * This method also sets the DatabaseResult to the request object, which is returned by the IDatabaseAccess method
	 * The method will throw a RuntimeException, when an invalid value (see DatabaseConstants) is passed.
	 * 
	 * @param dbreq request for dboperations like select, insert, update the db operations
	 * @return dbResult result of after executing request
	 * @exception DatabaseException
	 */
	protected DatabaseResult executeDBRequest(DatabaseRequest dbreq) throws DatabaseException
	{
		dbAMLogger.ctinfo("CTDBL00019");
		DatabaseResult dbResult = null;
		dbAMLogger.ctdebug("CTDBL00020");
		IDatabaseAccess idbAccess = DatabaseAccessFactory.getIDBAccessImplementation(dbreq.getDBAccessImpl());
		int operationToPerform = dbreq.getOperation();
		switch (operationToPerform)
		{
		// This case directs to the IDatabaseAccess interface for select operation
		case (DatabaseConstants.SELECT):
			dbAMLogger.ctinfo("CTDBL00021");
			dbResult = idbAccess.select(dbreq);
			break;
		// This case directs to the IDatabaseAccess interface for insert operation
		case (DatabaseConstants.INSERT):
			dbAMLogger.ctinfo("CTDBL00022");
			dbResult = idbAccess.insert(dbreq);
			break;
		// This case directs to the IDatabaseAccess interface for update operation
		case (DatabaseConstants.UPDATE):
			dbAMLogger.ctinfo("CTDBL00023");
			dbResult = idbAccess.update(dbreq);
			break;
		// This case directs to the IDatabaseAccess interface for delete operation
		case (DatabaseConstants.DELETE):
			dbAMLogger.ctinfo("CTDBL00024");
			dbResult = idbAccess.delete(dbreq);
			break;
		// This case direct to the IdatabaseAccess interface for batchInsert operation
		case (DatabaseConstants.BATCH_INSERT):
			dbAMLogger.ctinfo("CTDBL00025");
			dbResult = idbAccess.batchInsert(dbreq);
			break;
		// this case direct to the IdatabaseAccess interface for batchUpdate operation
		case (DatabaseConstants.BATCH_UPDATE):
			dbAMLogger.ctinfo("CTDBL00026");
			dbResult = idbAccess.batchUpdate(dbreq);
			break;

		// the next 4 cases direct to the IdatabaseAccess interface for executing StoredProcedures
		// having them as separate cases so that correct information is being logged in the log files
		case (DatabaseConstants.EXECUTE_SP_ONLY_RETURN_NO_OUT):
			dbAMLogger.ctinfo("CTDBL00027");
			dbResult = idbAccess.executeStoreProcedure(dbreq);
			break;
		case (DatabaseConstants.EXECUTE_SP_NO_RETURN_NO_OUT):
			dbAMLogger.ctinfo("CTDBL00028");
			dbResult = idbAccess.executeStoreProcedure(dbreq);
			break;
		case (DatabaseConstants.EXECUTE_SP_NO_RETURN_ONLY_OUT):
			dbAMLogger.ctinfo("CTDBL00029");
			dbResult = idbAccess.executeStoreProcedure(dbreq);
			break;
		case (DatabaseConstants.EXECUTE_SP_RETURN_AND_OUT):
			dbAMLogger.ctinfo("CTDBL00030");
			dbResult = idbAccess.executeStoreProcedure(dbreq);
			break;
		// If none of the above case is satisfied then throw a RuntimeException
		// saying the requuested operation is not supported
		default:
			dbAMLogger.cterror("CTDBL00031", operationToPerform);
			throw new RuntimeException("The Database Operation (operationKey:" + operationToPerform
					+ ") is either not supported or invalid.");
		}
		dbAMLogger.ctdebug("CTDBL00032");
		dbreq.setDatabaseResult(dbResult);

		dbAMLogger.ctinfo("CTDBL00033");
		return dbResult;

	}

	/**
	 * An instance of Logger
	 */
	private static final Logger dbAMLogger = Logger.getLogger(DatabaseAccessManager.class);
}