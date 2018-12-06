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

package com.intellectdesign.canvas.audit.handler;

/**
 * This class goes through the data to be auditted. In case there is any collection (List) of data, then it uses a
 * standard format for formatting the content in the list and places the same using a pattern. For example, if there is
 * a key INSTR_LIST which contains a list of hashmaps, then for this item, it audits the following -
 * translate(id_INSTR_LIST_COUNT}: #num items translate(id_INSTR_LIST_ELEM_LBL <num>}: value (hashmap serialized value)
 * and so on...
 * 
 * @version 1.0
 */
public class AuditDataCollectionFormatter extends AuditDataFormatter
{
	/**
	 * The only constructor.
	 */
	public AuditDataCollectionFormatter(AuditDataValue auditMasterConfig)
	{
		super(auditMasterConfig);
	}
}
