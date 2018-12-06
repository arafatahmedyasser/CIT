/*************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *************************************************************************/

package com.intellectdesign.canvas.database;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class decides how the records should be sorted considering the sortable columns and non-sortable columns
 * 
 * @version 1.0
 */
public class SortingModel implements Serializable
{

	/**
	 * UID for serialization
	 */
	private static final long serialVersionUID = 4577144750988990235L;

	/**
	 * An instance of Logger
	 */
	private transient Logger logger = Logger.getLogger(SortingModel.class);

	private static final String SORT_DIR = "dir";
	private static final String SORT_FIELD = "sort";

	public static final String SORT_DIRECTION_ASCENDING = "ASC";
	public static final String SORT_DIRECTION_DESCENDING = "DESC";

	private static final String DEFAULT_SORT_DIRECTION = SORT_DIRECTION_ASCENDING;

	private String sortField = ""; // this variable is initialized from the request params
	private String sortOrder = ""; // this is initialized from the request params
	private String uniqueSortField = null;
	private String uniqueFieldSortOrder = SORT_DIRECTION_DESCENDING;
	private String sortColumn = "";
	private String uniqueSortColumn = null;

	/**
	 * a default constructor
	 */
	public SortingModel()
	{
	}

	/**
	 * This constructor used to sorts the records based on the default sort coloumn
	 * 
	 * @param propertyMap
	 * 
	 * @param defaultSortColumn
	 * @param columnModelToDbFieldMap
	 * @throws UnsupportedOperationException if the propertyMap or columnModelToDbFieldMap is null or empty
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String defaultSortColumn, Map<String, String> columnModelToDbFieldMap)
	{
		if (propertyMap == null || propertyMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the propertyMap is null or empty.");
		}
		if (columnModelToDbFieldMap == null || columnModelToDbFieldMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the columnModelToDbFieldMap is null or empty.");
		}

		String aSortColumn = (String) propertyMap.get(SORT_FIELD);
		String sortDir = (String) propertyMap.get(SORT_DIR);
		String strSortField = columnModelToDbFieldMap.get(aSortColumn);
		String defaultSortField = columnModelToDbFieldMap.get(defaultSortColumn);
		constructSortingModel(strSortField, sortDir, defaultSortField, columnModelToDbFieldMap.values());
	}

	/**
	 * Variation of Sorting model constructor that takes the unique sort field and unique sort order as inputs, in
	 * addition to the standard inputs. The unique sort field concept is specially introduced for columns that does not
	 * have a unique data. For example Consider a column that contains 100 records). The livegrid fetches only first 45
	 * records(45 is configurable) due to pagination, when it fetches the next set of records, the records that were
	 * fetched during the first set may also appear, as we are sorting by a non unique field. In order to avoid this,
	 * this constructor will also sort by the unique field.
	 * 
	 * @param propertyMap
	 * @param sDefaultSortColumn
	 * @param columnModelToDbFieldMap
	 * @param sUniqueSortField
	 * @param sUniqueFieldSortOrder
	 * @throws UnsupportedOperationException if the propertyMap or columnModelToDbFieldMap is null or empty
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String sDefaultSortColumn, Map<String, String> columnModelToDbFieldMap,
			String sUniqueSortField, String sUniqueFieldSortOrder)
	{
		if (propertyMap == null || propertyMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the propertyMap is null or empty.");
		}
		if (columnModelToDbFieldMap == null || columnModelToDbFieldMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the columnModelToDbFieldMap is null or empty.");
		}

		String aSortColumn = (String) propertyMap.get(SORT_FIELD);
		String sortDir = (String) propertyMap.get(SORT_DIR);
		String strSortField = columnModelToDbFieldMap.get(aSortColumn);
		String defaultSortField = columnModelToDbFieldMap.get(sDefaultSortColumn);
		constructSortingModel(strSortField, sortDir, defaultSortField, columnModelToDbFieldMap.values(),
				sUniqueSortField, sUniqueFieldSortOrder);
	}

	/**
	 * Variation of Sorting model constructor that takes the unique sort field and unique sort order as inputs, in
	 * addition to the standard inputs. The unique sort field concept is specially introduced for columns that does not
	 * have a unique data. For example Consider a column that contains 100 records). The livegrid fetches only first 45
	 * records(45 is configurable) due to pagination, when it fetches the next set of records, the records that were
	 * fetched during the first set may also appear, as we are sorting by a non unique field. In order to avoid this,
	 * this constructor will also sort by the unique field.
	 * 
	 * @param propertyMap
	 * @param sDefaultSortColumn
	 * @param columnModelToDbFieldMap
	 * @param sUniqueSortField
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String sDefaultSortColumn, Map<String, String> columnModelToDbFieldMap,
			String sUniqueSortField)
	{
		this(propertyMap, sDefaultSortColumn, columnModelToDbFieldMap, sUniqueSortField, SORT_DIRECTION_DESCENDING);
	}

	/**
	 * This constructor used to sorts the records based on the default sort coloumn and default sort order
	 * 
	 * @param propertyMap
	 * @param defaultSortColumn
	 * @param defaultSortOrder
	 * @param columnModelToDbFieldMap
	 * @throws UnsupportedOperationException if the propertyMap or columnModelToDbFieldMap is null or empty
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String defaultSortColumn, String defaultSortOrder,
			Map<String, String> columnModelToDbFieldMap)
	{
		if (propertyMap == null || propertyMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the propertyMap is null or empty.");
		}
		if (columnModelToDbFieldMap == null || columnModelToDbFieldMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the columnModelToDbFieldMap is null or empty.");
		}

		String aSortColumn = (String) propertyMap.get(SORT_FIELD);
		String sortDir = (String) propertyMap.get(SORT_DIR);
		String strSortField = columnModelToDbFieldMap.get(aSortColumn);
		String defaultSortField = columnModelToDbFieldMap.get(defaultSortColumn);
		constructSortingModel(strSortField, sortDir, defaultSortField, defaultSortOrder,
				columnModelToDbFieldMap.values());
	}

	/**
	 * Variation of Sorting model constructor that takes the unique sort field and unique sort order as inputs, in
	 * addition to the standard inputs. The unique sort field concept is specially introduced for columns that does not
	 * have a unique data. For example Consider a column that contains 100 records). The livegrid fetches only first 45
	 * records(45 is configurable) due to pagination, when it fetches the next set of records, the records that were
	 * fetched during the first set may also appear, as we are sorting by a non unique field. In order to avoid this,
	 * this constructor will also sort by the unique field.
	 * 
	 * @param propertyMap
	 * @param defaultSortColumn
	 * @param defaultSortOrder
	 * @param columnModelToDbFieldMap
	 * @param sUniqueSortField
	 * @param sUniqueFieldSortOrder
	 * @throws UnsupportedOperationException if the propertyMap or columnModelToDbFieldMap is null or empty
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String defaultSortColumn, String defaultSortOrder,
			Map<String, String> columnModelToDbFieldMap, String sUniqueSortField, String sUniqueFieldSortOrder)
	{
		if (propertyMap == null || propertyMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the propertyMap is null or empty.");
		}
		if (columnModelToDbFieldMap == null || columnModelToDbFieldMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the columnModelToDbFieldMap is null or empty.");
		}

		String aSortColumn = (String) propertyMap.get(SORT_FIELD);
		String sortDir = (String) propertyMap.get(SORT_DIR);
		String strSortField = columnModelToDbFieldMap.get(aSortColumn);
		String defaultSortField = columnModelToDbFieldMap.get(defaultSortColumn);
		constructSortingModel(strSortField, sortDir, defaultSortField, defaultSortOrder,
				columnModelToDbFieldMap.values(), sUniqueSortField, sUniqueFieldSortOrder, null, null, null);
	}

	/**
	 * Variation of Sorting model constructor that takes the unique sort field and unique sort order as inputs, in
	 * addition to the standard inputs. The unique sort field concept is specially introduced for columns that does not
	 * have a unique data. For example Consider a column that contains 100 records). The livegrid fetches only first 45
	 * records(45 is configurable) due to pagination, when it fetches the next set of records, the records that were
	 * fetched during the first set may also appear, as we are sorting by a non unique field. In order to avoid this,
	 * this constructor will also sort by the unique field.
	 * 
	 * @param propertyMap
	 * @param defaultSortColumn
	 * @param defaultSortOrder
	 * @param columnModelToDbFieldMap
	 * @param sUniqueSortField
	 * @param sUniqueFieldSortOrder
	 * @param sUniqueSortColumnName
	 * @throws UnsupportedOperationException if the propertyMap or columnModelToDbFieldMap is null or empty
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String defaultSortColumn, String defaultSortOrder,
			Map<String, String> columnModelToDbFieldMap, String sUniqueSortField, String sUniqueFieldSortOrder,
			String sUniqueSortColumnName)
	{
		if (propertyMap == null || propertyMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the propertyMap is null or empty.");
		}
		if (columnModelToDbFieldMap == null || columnModelToDbFieldMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the columnModelToDbFieldMap is null or empty.");
		}

		String aSortColumn = (String) propertyMap.get(SORT_FIELD);
		String sortDir = (String) propertyMap.get(SORT_DIR);
		String strSortField = columnModelToDbFieldMap.get(aSortColumn);
		String defaultSortField = columnModelToDbFieldMap.get(defaultSortColumn);
		constructSortingModel(strSortField, sortDir, defaultSortField, defaultSortOrder,
				columnModelToDbFieldMap.values(), sUniqueSortField, sUniqueFieldSortOrder, aSortColumn,
				defaultSortColumn, sUniqueSortColumnName);
	}

	/**
	 * This method constructs the sorting model
	 * 
	 * @param strSortField
	 * @param strSortOrder
	 * @param defaultSortField
	 * @param defaultSortOrder
	 * @param listOfSortableFields
	 * @throws UnsupportedOperationException
	 * @throws ClassCastException
	 */

	private void constructSortingModel(String strSortField, String strSortOrder, String defaultSortField,
			String defaultSortOrder, Collection<String> listOfSortableFields)
	{
		if (defaultSortField == null || defaultSortField.equals(""))
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object defaultSortField is null or empty. defaultSortField is a manadatory input parameter for constructing a SortingModel object.");
		}
		if (defaultSortOrder == null || defaultSortOrder.equals(""))
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object defaultSortOrder is null or empty. defaultSortField is a manadatory input parameter for constructing a SortingModel object.");
		}
		if (listOfSortableFields == null || listOfSortableFields.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object if listOfSortableFields is null or empty. listOfSortableFields is a manadatory input parameter for constructing a SortingModel object.");
		}
		if (!listOfSortableFields.contains(defaultSortField))
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object if the given defaultSortField :" + defaultSortField
							+ " is not present in the listOfSortFields: " + listOfSortableFields.toString());
		}
		try
		{
			setSortField(strSortField, defaultSortField, listOfSortableFields);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00174", cce, defaultSortField);
			setSortField(defaultSortField);
		}
		try
		{
			setSortOrder(strSortOrder, defaultSortOrder);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00175", cce, defaultSortOrder);
			setSortOrder(defaultSortOrder);
		}
	}

	/**
	 * This method constructs the sorting model
	 * 
	 * @param strSortField
	 * @param strSortField
	 * @param defaultSortField
	 * @param defaultSortOrder
	 * @param listOfSortableFields
	 * @exception ClassCastException
	 */
	private void constructSortingModel(String strSortField, String strSortOrder, String defaultSortField,
			String defaultSortOrder, Collection<String> listOfSortableFields, String sUniqueSortField,
			String sUniqueFieldSortOrder, String aSortColumn, String defaultSortColumn, String sUniqueSortColumnName)
	{
		constructSortingModel(strSortField, strSortOrder, defaultSortField, defaultSortOrder, listOfSortableFields);
		updateSortingModel(strSortField, aSortColumn, defaultSortField, defaultSortColumn);

		try
		{
			setUniqueSortField(sUniqueSortField);
			this.uniqueSortColumn = sUniqueSortColumnName;
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00176", cce, defaultSortField);
			setUniqueSortField(defaultSortField);
			this.uniqueSortColumn = defaultSortColumn;
		}
		try
		{
			setUniqueFieldSortOrder(sUniqueFieldSortOrder);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00177", cce, defaultSortOrder);
			setUniqueFieldSortOrder(defaultSortOrder);
		}
	}

	/**
	 * Added a method to update the sort column in this class.
	 * 
	 * @param strSortField
	 * @param aSortColumn
	 * @param defaultSortField
	 * @param defaultSortColumn
	 */
	private void updateSortingModel(String strSortField, String aSortColumn, String defaultSortField,
			String defaultSortColumn)
	{

		if (this.sortField == strSortField)
		{
			this.sortColumn = aSortColumn;
		} else if (this.sortField == defaultSortField)
		{
			this.sortColumn = defaultSortColumn;
		}

	}

	/**
	 * This method constructs the sorting model
	 * 
	 * @param sortColumn
	 * @param strSortOrder
	 * @param defaultSortColumn
	 * @param columnModelToDbFieldMap
	 * @throws UnsupportedOperationException
	 */
	public SortingModel(String sortColumn, String strSortOrder, String defaultSortColumn,
			Map<String, String> columnModelToDbFieldMap)
	{
		if (columnModelToDbFieldMap == null || columnModelToDbFieldMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the columnModelToDbFieldMap is null or empty.");
		}
		String strSortField = columnModelToDbFieldMap.get(sortColumn);
		String defaultSortField = columnModelToDbFieldMap.get(defaultSortColumn);
		constructSortingModel(strSortField, strSortOrder, defaultSortField, columnModelToDbFieldMap.values());
	}

	/**
	 * Initializes the value object reading the property keys "sort" for sortfield and "dir" for sort order.
	 * 
	 * @param propertyMap the map where this keys will be present, this is typically the request params.
	 * @param defaultSortField , the default sort field to use in case sort field is not present. this field is mandatory
	 *            and should be present in the param listOfSortableFields
	 * @param listOfSortableFields , this has a list of possible sortable fields. Since the query would use string
	 *            substitution to include the order by clause, it is mandatory that we check the sort fields coming in
	 *            as input is indeed a valid sort field. Hence the above field is mandatory and at the minimum should
	 *            have the default sort field.
	 * @throws UnSupportedOperation exception if the mandatory inputs are absent and if the sort field available in the
	 *             property map is not present in the listofsortablefields.
	 */
	@SuppressWarnings("rawtypes")
	public SortingModel(Map propertyMap, String defaultSortField, Collection<String> listOfSortableFields)
	{
		if (propertyMap == null || propertyMap.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot construct a SortingModel object if the propertyMap is null or empty.");
		}
		constructSortingModel((String) propertyMap.get(SORT_FIELD), (String) propertyMap.get(SORT_DIR),
				defaultSortField, listOfSortableFields);
	}

	/**
	 * This method constructs the sorting model
	 * 
	 * @param strSortField
	 * @param strSortOrder
	 * @param defaultSortField
	 * @param listOfSortableFields
	 * @throws UnSupportedOperation exception if the mandatory inputs are absent and if the sort field available in the
	 *             property map is not present in the listofsortablefields.
	 */
	public SortingModel(String strSortField, String strSortOrder, String defaultSortField,
			List<String> listOfSortableFields)
	{
		constructSortingModel(strSortField, strSortOrder, defaultSortField, listOfSortableFields);
	}

	/**
	 * Sorts the record based on sort field , sort order ,defaultSortField and listOfSortableFields
	 * 
	 * @param strSortField
	 * @param strSortOrder
	 * @param defaultSortField
	 * @param listOfSortableFields
	 * @throws UnSupportedOperation exception if the mandatory inputs are absent and if the sort field available in the
	 *             property map is not present in the defaultSortField.
	 */
	public void constructSortingModel(String strSortField, String strSortOrder, String defaultSortField,
			Collection<String> listOfSortableFields)
	{
		if (defaultSortField == null || defaultSortField.equals(""))
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object defaultSortField is null or empty. defaultSortField is a manadatory input parameter for constructing a SortingModel object.");
		}
		if (listOfSortableFields == null || listOfSortableFields.isEmpty())
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object if listOfSortableFields is null or empty. listOfSortableFields is a manadatory input parameter for constructing a SortingModel object.");
		}
		if (!listOfSortableFields.contains(defaultSortField))
		{
			throw new UnsupportedOperationException(
					"Cannot Construct a SortingModel object if the given defaultSortField :" + defaultSortField
							+ " is not present in the listOfSortFields: " + listOfSortableFields.toString());
		}
		try
		{
			setSortField(strSortField, defaultSortField, listOfSortableFields);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00178", cce, defaultSortField);
			setSortField(defaultSortField);
		}
		try
		{
			setSortOrder(strSortOrder);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00179", cce, DEFAULT_SORT_DIRECTION);
			setSortOrder(DEFAULT_SORT_DIRECTION);
		}
	}

	/**
	 * Sorts the record based on sort field , sort order ,defaultSortField, listOfSortableFields and unique fields.
	 * 
	 * @param strSortField
	 * @param strSortOrder
	 * @param defaultSortField
	 * @param listOfSortableFields
	 * @param sUniqueSortField
	 * @param sUniqueFieldSortOrder
	 * @throws ClassCastException
	 * 
	 */
	public void constructSortingModel(String strSortField, String strSortOrder, String defaultSortField,
			Collection<String> listOfSortableFields, String sUniqueSortField, String sUniqueFieldSortOrder)
	{
		constructSortingModel(strSortField, strSortOrder, defaultSortField, listOfSortableFields);
		try
		{
			setUniqueSortField(sUniqueSortField);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00180", cce, defaultSortField);
			setUniqueSortField(defaultSortField);
		}
		try
		{
			setUniqueFieldSortOrder(sUniqueFieldSortOrder);
		} catch (ClassCastException cce)
		{
			logger.cterror("CTDBL00181", cce, DEFAULT_SORT_DIRECTION);
			setUniqueFieldSortOrder(DEFAULT_SORT_DIRECTION);
		}

	}

	/**
	 * Sets the sort field only if it is not null and not empty and if it is present in the list of sortable fields
	 * 
	 * @param strSortOrder
	 * @param defaultSortOrder
	 * @throws UnsupportedOperationException if the sortField is not present in the listOfSortableFields
	 */
	private void setSortOrder(String strSortOrder, String defaultSortOrder)
	{
		if (strSortOrder != null && !strSortOrder.equals(""))
		{
			this.sortOrder = strSortOrder;
		} else
		{
			logger.cterror("CTDBL00182", defaultSortOrder);
			this.sortOrder = defaultSortOrder;
		}
	}

	/**
	 * Sets the sort field only if it is not null and not empty and if it is present in the list of sortable fields
	 * 
	 * @param strSortField
	 * @param defaultSortField
	 * @param listOfSortableFields
	 * @throws UnsupportedOperationException if the sortField is not present in the listOfSortableFields
	 */
	private void setSortField(String strSortField, String defaultSortField, Collection<String> listOfSortableFields)
	{
		if (strSortField != null && !strSortField.equals(""))
		{

			if (listOfSortableFields.contains(strSortField))
				this.sortField = strSortField;
			else
			{
				throw new UnsupportedOperationException("Cannot Construct a SortingModel object if the sortField: "
						+ strSortField + " is not present in the listOfSortableFields: " + listOfSortableFields);
			}
		} else
		{
			logger.cterror("CTDBL00183", defaultSortField);
			this.sortField = defaultSortField;
		}
	}

	/**
	 * Gets the sort field
	 * 
	 * @return the sort field
	 */
	public String getSortField()
	{
		return sortField;
	}

	/**
	 * set the sortable field sets only if the passed parameter is not null
	 * 
	 * @param sortField
	 */
	private void setSortField(String sortField)
	{
		if (sortField != null)
			this.sortField = sortField;
	}

	/**
	 * Gets the sort order (Ascending or descending)
	 * 
	 * @return the sort order, A - Ascending, D- descending
	 */
	public String getSortOrder()
	{
		return sortOrder;
	}

	/**
	 * set the unique field sets only if the passed parameter is not null
	 * 
	 * @param sortField
	 */
	private void setUniqueSortField(String uniqueSortField)
	{
		if (uniqueSortField != null)
			this.uniqueSortField = uniqueSortField;
	}

	/**
	 * returns uniqueSortField
	 * 
	 * @return uniqueSortField
	 */
	public String getUniqueSortField()
	{
		return uniqueSortField;
	}

	/**
	 * set the unique field sort order sets only if the passed parameter is not null
	 * 
	 * @param sortField
	 */
	private void setUniqueFieldSortOrder(String uniqueFieldSortOrder)
	{
		if (uniqueFieldSortOrder != null)
			this.uniqueFieldSortOrder = uniqueFieldSortOrder;
	}

	/**
	 * returns uniqueFieldSortOrder
	 * 
	 * @return the unique field's sort order
	 */
	public String getUniqueFieldSortOrder()
	{
		return uniqueFieldSortOrder;
	}

	/**
	 * This method returns the columns name for sorting
	 * 
	 * @return the sortColumn the column name to be sorted
	 */
	public String getSortColumn()
	{
		return sortColumn;
	}

	/**
	 * This method sets the sorting column name
	 * 
	 * @param sortColumn the column name for sorting
	 */
	public void setSortColumn(String sortColumn)
	{
		this.sortColumn = sortColumn;
	}

	/**
	 * return the uniqueSortColumn
	 * 
	 * @return the uniqueSortColumn
	 */
	public String getUniqueSortColumn()
	{
		return uniqueSortColumn;
	}

	/**
	 * used to set the uniqueSortColumn
	 * 
	 * @param uniqueSortColumn the uniqueSortColumn to set
	 */
	public void setUniqueSortColumn(String uniqueSortColumn)
	{
		this.uniqueSortColumn = uniqueSortColumn;
	}

	/**
	 * sets the sort order only if the param sortorder is not null also the sort order should be ASC or DSC if not, the
	 * default sort order of ASC is set
	 * 
	 * @param sortOrder
	 */
	private void setSortOrder(String sortOrder)
	{
		if (sortOrder != null && !sortOrder.equals(""))
		{
			if (sortOrder.equalsIgnoreCase(SORT_DIRECTION_ASCENDING)
					|| sortOrder.equalsIgnoreCase(SORT_DIRECTION_DESCENDING))
			{
				this.sortOrder = sortOrder;
			} else
			{
				logger.cterror("CTDBL00184", sortOrder, SORT_DIRECTION_ASCENDING, SORT_DIRECTION_DESCENDING,
						SORT_DIRECTION_ASCENDING);
				this.sortOrder = DEFAULT_SORT_DIRECTION;
			}
		} else
		{
			logger.cterror("CTDBL00185", DEFAULT_SORT_DIRECTION);
			this.sortOrder = DEFAULT_SORT_DIRECTION;
		}
	}

	/**
	 * overrides the tostring method to provide the sort field and sort direction value
	 * 
	 * @return {sortfield:<value>,sortDirection:<value>}
	 */
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("{sortfield : ");
		sb.append(this.sortField);
		sb.append(",sortDirection : ");
		sb.append(this.sortOrder);
		sb.append(",Unique Sort Field : ");
		sb.append(this.uniqueSortField);
		sb.append(",Unique Field Sort Order : ");
		sb.append(this.uniqueFieldSortOrder);
		sb.append("}");
		return sb.toString();
	}

}
