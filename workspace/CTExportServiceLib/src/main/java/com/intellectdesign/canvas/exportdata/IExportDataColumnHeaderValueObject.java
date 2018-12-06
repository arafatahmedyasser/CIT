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

package com.intellectdesign.canvas.exportdata;

/**
 * The interface models and encapsulates the column header details required for report generation
 * 
 * @version 1.0
 */
public interface IExportDataColumnHeaderValueObject
{
	/**
	 * This method is used to get the HeaderKey
	 * 
	 * @returns the header key
	 */

	public String getHeaderKey();

	/**
	 * This method is used to get the HeaderType
	 * 
	 * @returns the header type
	 */

	public String getHeaderType();

	/**
	 * This method is used to get the HeaderDescription
	 * 
	 * @returns the HeaderDescription
	 */

	public String getHeaderDescription();

	/**
	 * This method is used to set the HeaderKey
	 * 
	 * @param HeaderKey to set
	 */

	public void setHeaderKey(String sHeaderKey);

	/**
	 * This method is used to set the HeaderDescription
	 * 
	 * @param HeaderDescription to set
	 */

	public void setHeaderDescription(String sDescription);

	/**
	 * This method is used to set the HeaderType
	 * 
	 * @param HeaderType to set
	 */

	public void setHeaderType(String sHeaderType);
}
