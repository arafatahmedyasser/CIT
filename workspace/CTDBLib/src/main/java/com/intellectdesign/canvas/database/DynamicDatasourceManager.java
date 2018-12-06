/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.database;

import java.io.IOException;
import java.io.Reader;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.ibatis.common.resources.Resources;
import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapClientBuilder;
import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.reader.CTProperties;
import com.intellectdesign.canvas.utils.EncryptionUtility;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class manages all the dynamic data sources and related connections. This works on top of 2 application level
 * caches - DYNAMIC_DATASOURCES, DYNAMIC_CONNECTIONS. This provides API's for the database framework to quickly retrieve
 * the configuration for dynamic data sources that are configured through Canvas Studio
 */
public class DynamicDatasourceManager
{
	/**
	 * The list of connection types that are supported
	 */
	public enum ConnectionType
	{
		/**
		 * Connectivity to Oracle Database
		 */
		DATABASE_ORACLE("oracle"),
		/**
		 * Connectivity to My SQL database
		 */
		DATABASE_MYSQL("mysql"),
		/**
		 * Connectivity to Microsoft SQL Server
		 */
		DATABASE_MS_SQL_SERVER("mssql"),
		/**
		 * Connectivity to IBM DB2 Database
		 */
		DATABASE_DB2("db2"),
		/**
		 * Connectivity to the Intellect Message Hub
		 */
		INTELLECT_MH("mh"),
		/**
		 * This is more for exception handling where the connection type is undefined
		 */
		UNDEFINED("undefined");

		private ConnectionType(String type)
		{
			this.type = type;
		}

		/**
		 * @return
		 * @see java.lang.Enum#toString()
		 */
		@Override
		public String toString()
		{
			return type;
		}

		/**
		 * Method to check whether a connection type matches with any of the values present in the enumerator
		 * 
		 * @param passedValue
		 * @return true, if connection type matches. false otherwise
		 */
		public boolean equalValue(String passedValue)
		{
			return this.type.equals(passedValue);
		}

		private String type;
	}

	/**
	 * The default constructor
	 */
	public DynamicDatasourceManager()
	{
		// Nothing to do here.
	}

	/**
	 * This method resets / clears the connection information from the cache. This would result in the subsequent access
	 * to this connection re initialiazing itself from scratch
	 * 
	 * @param connId The connection id to be reset
	 * @throws DatabaseException Thrown if any error occurs while resetting the connection from cache
	 */
	public void resetConnectionInCache(String connId) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00195");
		Map connData = getDynamicConnectionData(connId, false);
		if (connData != null)
		{
			CacheManager mgr = CacheManager.getFWInstance();
			Map dsConnData = (Map) mgr.getDataFromCache(null, "DYNAMIC_CONNECTIONS").get(0);
			// Remove from cache
			dsConnData.remove(connData);
		}
		LOGGER.ctdebug("CTDBL00196");
	}

	/**
	 * This method resets / clears the data source information from the cache. This would result in the subsequent
	 * access to this data source re initialiazing itself from scratch
	 * 
	 * @param dataSourceId The Data source id to be reset
	 * @throws DatabaseException Thrown if any error occurs while resetting the data source from cache
	 */
	public void resetDataSourceInCache(String dataSourceId) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00197");
		Map dsData = getDynamicDataSourceData(dataSourceId, false);
		if (dsData != null)
		{
			CacheManager mgr = CacheManager.getFWInstance();
			Map dsCacheData = (Map) mgr.getDataFromCache(null, "DYNAMIC_DATASOURCES").get(0);
			// Remove from cache
			dsCacheData.remove(dsData);
		}
		LOGGER.ctdebug("CTDBL00198");
	}

	/**
	 * This method returns the connection type for the specified data source
	 * 
	 * @param dataSourceId The Id of the data source
	 * @return The Connection Type associated to this data source
	 * @throws DatabaseException Thrown if any error occurs while retrieving the data source / connection details
	 */
	public ConnectionType getConnectionTypeForDataSource(String dataSourceId) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00199");
		ConnectionType returnValue = ConnectionType.UNDEFINED;
		// Step 1: Get the data source details from cache.
		Map dsData = getDynamicDataSourceData(dataSourceId, true);
		LOGGER.ctinfo("CTDBL00200", dataSourceId, dsData);
		if (dsData != null)
		{
			// Step 2: Get the connection details for the data source.
			String connId = (String) dsData.get("CONNECTION_ID");
			Map connData = getDynamicConnectionData(connId, true);
			LOGGER.ctinfo("CTDBL00201", dataSourceId, connData);
			if (connData != null)
				returnValue = (ConnectionType) connData.get("CONNECTION_TYPE");
		}
		LOGGER.ctinfo("CTDBL00202", dataSourceId, returnValue);
		LOGGER.ctdebug("CTDBL00203");
		return returnValue;
	}

	/**
	 * This method retrieves the SqlMapClient against the connection linked to the data source id provided.
	 * 
	 * @param dataSourceId The data source id for which the SqlMapClient needs to be retrieved
	 * @return The SQLMapClient for this data source. if there is no sqlmap identified, then this returns null
	 * @throws DatabaseException Thrown if any error occurs while initializing or identification of the SqlMapClient
	 *             based on the data source id provided
	 */
	public SqlMapClient getSqlMapInstanceFor(String dataSourceId) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00204");
		SqlMapClient returnValue = null;
		// Step 1: Get the data source details from cache.
		Map dsData = getDynamicDataSourceData(dataSourceId, true);
		LOGGER.ctinfo("CTDBL00200", dataSourceId, dsData.toString());
		// Step 2: Get the connection details for the data source.
		String connId = (String) dsData.get("CONNECTION_ID");
		Map connData = getDynamicConnectionData(connId, true);
		LOGGER.ctinfo("CTDBL00201", dataSourceId, connData);
		if (connData == null)
		{
			throw new DatabaseException("Connection '" + connId + "' linked with data source '" + dataSourceId
					+ "' is not available. Please check the configuration");
		}

		// Step 3: Check the type of connection. Only if it is a database type, then we can handle it.
		ConnectionType connType = (ConnectionType) connData.get("CONNECTION_TYPE");
		LOGGER.ctinfo("CTDBL00202", dataSourceId, connType);
		switch (connType)
		{
		case DATABASE_ORACLE:
		case DATABASE_DB2:
		case DATABASE_MS_SQL_SERVER:
		case DATABASE_MYSQL:
			returnValue = (SqlMapClient) connData.get("SQLMAPCLIENT");
			break;
		default:
			break;
		}
		LOGGER.ctdebug("CTDBL00205");
		return returnValue;
	}

	/**
	 * Helper method that retrieves the dynamic data source details
	 * 
	 * @param dataSourceId The id of the data source
	 * @param loadIfNotPresent If true, then the data source details are loaded from repository if the same is not
	 *            present in cache
	 * @return The data source details
	 * @throws DatabaseException Error thrown if there are any issues while trying to retrieve the datasource details
	 */
	public Map getDynamicDataSourceData(String dataSourceId, boolean loadIfNotPresent) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00206");
		LOGGER.ctinfo("CTDBL00207", dataSourceId);
		if (StringUtils.isEmpty(dataSourceId))
			throw new DatabaseException("Data Source Id provided cannot be null or empty");

		CacheManager mgr = CacheManager.getFWInstance();
		Map dsCacheData = (Map) mgr.getDataFromCache(null, "DYNAMIC_DATASOURCES").get(0);
		Map dsData;
		if (loadIfNotPresent && !dsCacheData.containsKey(dataSourceId))
		{
			// Could mean that the data source is not retrieved it. So retrieve and add it to cache
			dsData = retrieveDataSourceDetails(dataSourceId, dsCacheData);
		} else
			dsData = (Map) dsCacheData.get(dataSourceId);
		LOGGER.ctinfo("CTDBL00200", dataSourceId, dsData.toString());
		LOGGER.ctdebug("CTDBL00208");
		return dsData;
	}

	/**
	 * Helper method that retrieves the dynamic connection details
	 * 
	 * @param connId The id of the connection
	 * @param loadIfNotPresent If true, then the connection details are loaded from repository if the same is not
	 *            present in cache
	 * @return The connection details
	 * @throws DatabaseException Error thrown if there are any issues while trying to retrieve the connection details
	 */
	public Map getDynamicConnectionData(String connId, boolean loadIfNotPresent) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00209");
		LOGGER.ctinfo("CTDBL00210", connId);
		if (StringUtils.isEmpty(connId))
			throw new DatabaseException("Connection Id provided cannot be null or empty");

		CacheManager mgr = CacheManager.getFWInstance();
		Map dsConnData = (Map) mgr.getDataFromCache(null, "DYNAMIC_CONNECTIONS").get(0);
		Map connData;
		if (loadIfNotPresent && !dsConnData.containsKey(connId))
		{
			// Could mean that the connection has not yet been retrived. So retrieve and add it to cache
			// Could mean that the data source is not retrieved it. So retrieve and add it to cache
			connData = retrieveConnectionDetails(connId, dsConnData);
		} else
			connData = (Map) dsConnData.get(connId);
		LOGGER.ctinfo("CTDBL00211", connId, connData.toString());
		LOGGER.ctdebug("CTDBL00212");
		return connData;
	}

	/**
	 * Helper method that retrieves the details of the data source based on the data source Id
	 * 
	 * @param dataSourceId The Id of the data source
	 * @return The details of the data source
	 * @throws DatabaseException Thrown if any error occurs while retrieving the details of the data source
	 */
	private synchronized Map retrieveDataSourceDetails(String dataSourceId, Map cacheData) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00213");
		DatabaseRequest req = new CanvasDatabaseRequest();
		req.setDataAccessMapKey("VIEW_MGR_FRMWK_MNT");
		req.setOperation(DatabaseConstants.SELECT);
		req.setOperationExtension("GET_DATA_SOURCE_DETAILS");
		req.addFilter("DATA_SRC_ID", dataSourceId);

		List<Map> selectedRecords = req.execute().getReturnedList();
		if (selectedRecords.isEmpty())
			return null;

		// Only one record expected to be returned. Before returning, add it to the cache
		cacheData.put(dataSourceId, selectedRecords.get(0));
		LOGGER.ctdebug("CTDBL00214");
		return selectedRecords.get(0);
	}

	/**
	 * Helper method that retrieves the connection details for the given connection Id
	 * 
	 * @param connId The id of the connection to retrieve
	 * @param connData The connection cache data into which the connection details are to be added
	 * @return The data for the specified connection
	 * @throws DatabaseException Thrown if any error occurs while fetching the connection information
	 */
	private synchronized Map retrieveConnectionDetails(String connId, Map connData) throws DatabaseException
	{
		LOGGER.ctdebug("CTDBL00215");
		DatabaseRequest req = new CanvasDatabaseRequest();
		req.setDataAccessMapKey("VIEW_MGR_FRMWK_MNT");
		req.setOperation(DatabaseConstants.SELECT);
		req.setOperationExtension("GET_CONNECTION_DETAILS");
		req.addFilter("CONNECTION_ID", connId);

		List<Map> selectedRecords = req.execute().getReturnedList();
		if (selectedRecords.isEmpty())
			return null;

		// Only one record expected to be returned. Before returning, add it to the cache
		Map selectedData = selectedRecords.get(0);

		String connTypeVal = (String) selectedData.get("CONNECTION_TYPE");
		ConnectionType connType = null;
		try
		{
			// Convert the connection type to an ENUM
			for (ConnectionType conType : ConnectionType.values())
			{
				if (conType.equalValue(connTypeVal))
				{
					connType = conType;
					break;
				}
			}
			// connType = ConnectionType.valueOf(connTypeVal);
			selectedData.put("CONNECTION_TYPE", connType);
		} catch (IllegalArgumentException e)
		{
			throw new DatabaseException("Connection Type '" + connTypeVal
					+ "' is not a valid type supported by Canvas. Please check your configuration", e);
		}

		switch (connType)
		{
		// Only for the database connection type, we need to do some special handling
		case DATABASE_ORACLE:
		case DATABASE_DB2:
		case DATABASE_MS_SQL_SERVER:
		case DATABASE_MYSQL:
			// Create a SqlMapClient for this connection and add it into the map.
			/**
			 * The connection parameters are populated in properties. This will be used to populate values for the xml,
			 * which will be used to create the connection
			 */

			String userName = null;
			String password = null;
			userName = (String) selectedData.get("USER_NAME");
			password = (String) selectedData.get("USER_PASSWORD");
			// if the user name/password is encrypted then it will be in the format
			// "{EncryptionAlgorithm:EncryptedText}"
			// if it is in the above pattern and if the EncryptionAlgorithm is one of the supported values
			// then, it will be decrypted. Else, the entire string will be used as username/password
			userName = getPlainText(userName, connId);
			password = getPlainText(userName, connId);
			Properties properties = new Properties();
			properties.put("DRIVER", selectedData.get("DRIVER_CLASS"));
			properties.put("CONNECTION_STRING", selectedData.get("CONNECTION_STRING"));
			properties.put("USER_NAME", userName);
			properties.put("USER_PASSWORD", password);
			properties.put("CONNECTION_TYPE", connTypeVal);
			String jndiName = (String) selectedData.get("CONN_JNDI_NAME");
			Boolean jndiExists = false;
			jndiExists = !StringUtils.isEmpty(jndiName);
			if (jndiExists)
				properties.put("CONN_JNDI_NAME", jndiName);
			String dataSourceKey = CTProperties.getProperty(!jndiExists ? "DYNAMIC_DATASOURCE_DSXML"
					: "DYNAMIC_JNDI_DATASOURCE_DSXML");
			try
			{
				Reader reader = Resources.getResourceAsReader(dataSourceKey);
				/**
				 * Creating the SqlMapClient, which will be used to get the query to fetch the data for the view
				 */
				SqlMapClient sqlMap = SqlMapClientBuilder.buildSqlMapClient(reader, properties);
				selectedData.put("SQLMAPCLIENT", sqlMap);
			} catch (IOException e)
			{
				// This means that there is some issue in the ibatis configuration file that is being identified for
				// this connection
				throw new DatabaseException("Error while loading the resource '" + dataSourceKey
						+ "'. Please check your configuration", e);
			} catch (Throwable t)
			{
				// Ibatis build sequence throws runtime exception. Wrapping up the same into a proper checked exception
				throw new DatabaseException("Error while creating Sql Map client for Connection id '" + connId
						+ "'. Please check your configuration", t);
			}
			break;
		default:
			// For all others, there is nothing special to do.
			break;
		}

		connData.put(connId, selectedData);
		LOGGER.ctinfo("CTDBL00211", connId, connData.toString());
		LOGGER.ctdebug("CTDBL00216");
		return selectedData;
	}

	/**
	 * This method is to return the plain text if the input text is in the format "{EncryptionAlgorithm:EncryptedText}";
	 * else it will return the input text as such. If the user name/password is encrypted then it will be
	 * 
	 * @param text
	 * @return encrypted text
	 */
	public String getPlainText(String text, String connId)
	{
		String tokens[];
		String plainText = text;
		tokens = StringUtils.split(text, ":");
		// Ensure that the first token (which will have the encryption algo) is present and the number of tokens is 2.
		// The text is expected in the pattern - {ALGO:EncryptedText}
		if (!StringUtils.isEmpty(tokens[0]) && tokens.length > 1)
		{
			// tokens[0].substring(1) will give the EncryptionAlgorithm
			String algorithmName = tokens[0].substring(1);
			String encryptedValue = tokens[1].substring(0, tokens[1].length()-1);
			try
			{
				EncryptionUtility.Algorithm algo = EncryptionUtility.getAlgorithmFor(algorithmName);
				plainText = algo.decrypt(encryptedValue, connId);
			} catch (BaseException e)
			{
				// Means error while doing decryption. In this scenario, take the value to be of plain text itself and
				// log the error.
				LOGGER.cterror("CTDBL00219", e, algorithmName);
			}
		}
		return plainText;
	}

	private static final Logger LOGGER = Logger.getLogger(DynamicDatasourceManager.class);
}
