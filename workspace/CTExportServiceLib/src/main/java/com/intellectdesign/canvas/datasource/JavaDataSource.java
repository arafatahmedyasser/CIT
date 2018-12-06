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

/**
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */

package com.intellectdesign.canvas.datasource;

import java.util.HashMap;

/**
 * To change the template for this generated type comment go to Window > Preferences > Java > Code Generation > Code and
 * Comments
 * 
 * @contact ezReports team
 * 
 * @version 1.0
 */
public interface JavaDataSource
{
	/**
	 * -------------------------- Input Param(s) - hmParams --------------------------
	 * 
	 * hmParams is a HashMap of various parameters passed to this method. The various keys and datatypes of hmParams are
	 * listed below: Key Datatype
	 * 
	 * ------------------------------- -----------------------------------------------
	 * 
	 * queryParameters String[] sortByColumnNumber int recordsDisplayMode int startRowNumber int rowsPerPage int
	 * 
	 * -----------------------------------Description-----------------------------------------
	 * 
	 * 1. queryParameters - String array of different query parameters. Pass each parameter as an array element.
	 * 
	 * 2. sortByColumnNumber - Column number by which the data should be sorted and sent
	 * 
	 * 3.recordsDisplayMode - The value 0 will be passed if all records are required and no pagenation is needed. 1 will
	 * be passed if records need to be shown in pages of 'n' number of records per page.
	 * 
	 * 4. startRowNumber - Startingposition of the record to be fetched. Applicable only if recordsDisplayMode is 1.
	 * 
	 * 5. rowsPerPage - Number of rows to be shown per page, as defined in the Report's definition. Applicable only if
	 * recordsDisplayMode is 1.
	 * 
	 * ------------------------- Return Value - ArrayList -------------------------------------
	 * 
	 * This method returns an arraylist of the resultset data. The arraylist returned should contain all the columns in
	 * the same order as defined in the Report's columns. It may contain excess columns that may not be defined, these
	 * will not get displayed in the report.
	 * 
	 * @param hmParams
	 * @return HashMap
	 */

	public HashMap execute(HashMap hmParams);
}
