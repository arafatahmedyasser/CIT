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

package com.intellectdesign.canvas.entitlement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.event.Event;

/**
 * Entitlement Engine interface: This interface provides APIs for the following purposes: 1. To get the list ofall
 * entitled users for an associated Event and the Entitlement criteria type. The entitlement criteria might be a
 * paramater on which the entitlement needs to be validated.example: User can be checked whether he is entitled to
 * certain account numbers, in this case the entitlement criteria is ACC_NO (Account number). 2. To check whether a user
 * is entitled to a certain set of data specified by the product,sub sproduct ,functio code as defined in the Event and
 * also to the entitlement criteria type specified. 3. To retrieve the entitlement criteria for combinations of
 * parameters specified.
 * 
 * @version 1.0
 */
public interface IEntitlementEngine
{
	/**
	 * This api intends to fetch the list of all the user who are entitled for the given Event against an entitlement
	 * criteria data. The criteria data can be account numbers or any other parameters as per the implementation
	 * specific.
	 * 
	 * @param event , The event associated, which is the source for the product, sub product and the function code to be
	 *            passed.
	 * @param Data , The actual data to be check against the entitlement,eg. may be an account number to be checked.
	 * @return ArrayList of Entitled users id of the type String.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitledUsers(Event event, Map Data) throws EntitlementEngineException;

	/**
	 * This api intends to check whether a user is entitled for the Event against the entitlement crtiteria specified in
	 * the parameter HashMap Data.
	 * 
	 * @param event : the event that is associated with the action. This will provide the product, sub product and the
	 *            function code.
	 * @param sUserNo : the user number of the user.
	 * @param Data : the data for which the entilement is to be checked for the user.
	 * @return boolean : whether user is entitled or not.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public boolean isUserEntitled(Event event, String sUserNo, HashMap Data) throws EntitlementEngineException;

	/**
	 * API to get the entitlement Criteria for the combination of the parameters passed.
	 * 
	 * @param userNo : the user number of the user.
	 * @param gcif : the gcif number of the user.
	 * @param sProduct : the product code associated.
	 * @param sSubProduct : the sub product code associated.
	 * @param sFunction : the function code associated.
	 * @return ArrayList of entitlement criteria.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, String sProduct, String sSubProduct,
			String sFunction) throws EntitlementEngineException;

	/**
	 * API to get the entitlement Criteria for the combination of parameters passed.
	 * 
	 * @param userNo : the user number of the user.
	 * @param gcif : the gcif number of the user.
	 * @param sProduct : the product code associated.
	 * @param sSubProduct : the sub product code associated.
	 * @return ArrayList of entitlement criteria.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, String sProduct, String sSubProduct)
			throws EntitlementEngineException;

	/**
	 * API to get the entitlement Criteria for the combination of parameters passed.
	 * 
	 * @param userNo : the user number of the user.
	 * @param gcif : the gcif number of the user.
	 * @param sProduct the product code associated.
	 * @return ArrayList of entitlement criteria.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, String sProduct)
			throws EntitlementEngineException;

	/**
	 * API to get the entitlement Criteria for the combination of parameters passed.
	 * 
	 * @param userNo the user number of the user.
	 * @param gcif the gcif number of the user.
	 * @param event the event associated.
	 * @return ArrayList of entitlement criteria.
	 * @throws EntitlementEngineException for any exception caught.
	 */
	public ArrayList<String> getEntitlementCriteria(String userNo, String gcif, Event event)
			throws EntitlementEngineException;
}
