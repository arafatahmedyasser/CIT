/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
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

package com.intellectdesign.canvas.viewdefinition;

import java.util.List;

/**
 * This interface provides encapsulation for methods the handles the data from data-source to the View
 * 
 * @version 1.0
 */
public interface IViewDefinitionInstruction
{
	/**
	 * This method is used to find all views defined for User and GCIF combination. 
	 * This includes system defined views as well. i.e. views where user id and GCIF are null. 
	 * Ideally used for maintenance programs and lists.
	 * 
	 * @param UserNo - String value of the User No
	 * @param GCIF - String value of the GCIF
	 * @return ViewDefinition - List object that contains the View and Column Definition data
	 * 
	 * @throws ViewDefinitionException
	 */
	public List getAllViewDefinitions(String UserNo, String GCIF) throws ViewDefinitionException;

	/**
	 * This method used to retrieve view definition for a viewId
	 * 
	 * @param viewId - String value of the View Id
	 * @return ViewDefinition - ViewDefinition object that contains the View and Column Definition Data
	 * @throws ViewDefinitionException
	 */
	public ViewDefinition getViewDefinition(String viewId) throws ViewDefinitionException;

	/**
	 * This method is used to create a new view from the given view definition
	 * 
	 * @param viewDefinition - ViewDefinition object that contains view detail 
	 * @return ViewId - String value of the newly created View Id
	 * @throws ViewDefinitionException
	 */
	public String createView(ViewDefinition viewDefinition) throws ViewDefinitionException;

	/**
	 * This method updates the data in the view definition. 
	 * If the parameter isRestoreDefaults is true, then it performs rollback of changes done to the
	 * default system view definition.
	 * 
	 * @param viewDefinition - ViewDefinition object that contains the view detail
	 * @param isRestoreDefaults - boolean flag indicating need to rollback the changes or not
	 * @param sUserNo - String value of the User No
	 * @param sGcifID - String value of the GCIF Id
	 * @throws ViewDefinitionException
	 */
	public void updateViewDefinition(ViewDefinition viewDefinition, boolean isRestoreDefaults, String sUserNo,
			String sGcifID) throws ViewDefinitionException;

	/**
	 * This method deletes the view definition and its associated column definition for the given view id. 
	 * 
	 * 
	 * @param sViewID - String value of the View Id to be deleted
	 * @param sUserNo - String value of the User No
	 * @param sGcifID - String value of the GCIFID
	 * 
	 * @throws ViewDefinitionException
	 */
	public void deleteViewDefinition(String sViewID, String sUserNo, String sGcifID) throws ViewDefinitionException;
}