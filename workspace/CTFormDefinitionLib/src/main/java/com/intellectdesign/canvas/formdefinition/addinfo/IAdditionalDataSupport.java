/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.addinfo;

import java.util.ArrayList;
import java.util.HashMap;

import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormItemDefinition;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This interface for iadditional data support.
 * 
 * @version 1.0
 */
public interface IAdditionalDataSupport
{

	/**
	 * This method is invoked by the Form Manager to provide a hook for the data support to handle the data fetch for
	 * fields that need additional data. This method is intended to provide a list of all the supported data that is
	 * needed for the Form Item whose definition is passed as a parameter to this method.
	 * 
	 * @param itemDefn - FormItemDefinition that contains the items needing additional data
	 * @param userValue - UserValue object containing logged on user details
	 * @param inputParams - Hashmap of cached client input parameters
	 * @return ArrayList<AdditionalDataCodeValue> - AdditonalData Display Value and the Data Code
	 * @throws FormDefinitionException
	 */
	ArrayList<AdditionalDataCodeValue> getAdditionalDataFor(FormItemDefinition itemDefn, IUserValue userValue,
			HashMap inputParams) throws FormDefinitionException;
}
