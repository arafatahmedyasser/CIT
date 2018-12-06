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

import java.util.List;
import java.util.Map;

/**
 * Its a class for IApp Container Entitlement.
 * 
 * @version 1.0
 */
public interface IAppContainerEntl
{
	/**
	 * To check whether the service is entitled or not
	 * 
	 * @param recordMap
	 * @param userNo
	 * @param gcif
	 * @return boolean
	 */

	public Boolean isServiceEntitled(Map recordMap, String userNo, String gcif);

	/**
	 * Added new API for one shot entitlement
	 * 
	 * @param recordList
	 * @param userNo
	 * @param gcif
	 */
	public void getEntitledServices(List recordList, String userNo, String gcif);

}
