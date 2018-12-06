/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.validator;
import java.util.ArrayList;
import java.util.HashMap;
/**
 * This interface is for Server Validator.
 * 
 * @version 1.0
 */
public interface ServerValidator
{

	/**
	 * The <code>validate</code> process the special character,integer,mandatory check based on the value parsed from
	 * xml has well the data passed from aps system as hashmap for validation
	 * 
	 * @param HashMap $hashMap
	 * @param ArrayList $optList
	 * @exception throws ValidationException
	 * @return String - Returns error codes separated by comma(,) if any else
	 */
	public String validate(HashMap $hashMap, ArrayList $list) throws ValidationException;
	
}
