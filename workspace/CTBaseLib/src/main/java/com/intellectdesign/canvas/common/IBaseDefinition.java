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
package com.intellectdesign.canvas.common;

import java.io.Serializable;

/**
 * This intetface is for IBaseDefintions Containg Serializable
 *  
 * @version 1.0
 */
public interface IBaseDefinition extends Cloneable, Serializable
{
	/**
	 * Default vaule of SerializableUID Internal constant for serialization purposes
	 * 
	 * @return
	 */
	public String toJSONString();
}
