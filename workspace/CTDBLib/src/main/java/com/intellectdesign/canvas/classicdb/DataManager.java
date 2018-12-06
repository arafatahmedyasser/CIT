/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 */
package com.intellectdesign.canvas.classicdb;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Properties;
import java.util.StringTokenizer;
import java.util.Vector;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.transaction.UserTransaction;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.DBConfigurationDescriptor;
import com.intellectdesign.canvas.logger.Logger;

/**
 * A connection with a specific database. Within the context of a Connection, SQL statements are executed and results
 * are returned.This class can be used by both the Entity and the Implementation class to make transactions.
 * 
 * @version 1.0
 * 
 */
public class DataManager
{
	private static final Logger logger = Logger.getLogger(DataManager.class);

	public static final String FACTORY_INITIAL = (ConfigurationManager.getInstance()).getDBDescriptor()
			.getJndiFactory();
	public static final String PROVIDER_URL = (ConfigurationManager.getInstance()).getDBDescriptor().getProviderUrl();

	private Connection m_dbConnection;

	/**
	 * Creates a new Conenction object using the Data source name
	 * 
	 * 
	 * @exception SQLException when the connection pool doesnt exist
	 */

	public DataManager() throws SQLException
	{
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			String poolName = configMgr.getDBDescriptor().getImplDataSourceName();

			DataSource ds = null;

			if (poolName.indexOf("java:comp/env/jdbc") < 0)
				ds = RemoteLookupDataSourceCache.getDataSource(); // For Maintenance Screens
			else
				ds = DataSourceCache.getDataSource();

			m_dbConnection = ds.getConnection();

		} catch (Exception e)
		{
			logger.cterror("CTDBL00010", e);
		}
	}

	/**
	 * Creates a new Conenction object using the specified pool name
	 * 
	 * @param poolName
	 * @throws SQLException
	 */
	public DataManager(String poolName) throws SQLException
	{
		try
		{
			DataSource ds = null;
			poolName = "java:comp/env/jdbc/" + poolName;
			if (poolName.indexOf("java:comp/env/jdbc") < 0)
				ds = RemoteLookupDataSourceCache.getDataSource(); // For Maintenance Screens
			else
				ds = DataSourceCache.getDataSource();
			m_dbConnection = ds.getConnection();
		} catch (Exception e)
		{
			logger.cterror("CTDBL00010", e);
		}
	}

	/**
	 * Returns user transaction name
	 * 
	 * @return Returns the UserTransaction
	 */
	public static UserTransaction getUserTransaction()
	{
		return getTransaction("USER_TXN_NAME");
	}

	/**
	 * Returns remote transaction name
	 * 
	 * @return UserTransaction
	 */
	public static UserTransaction getRemoteTransaction()
	{
		return getTransaction("REMOTE_TXN_NAME");
	}

	/**
	 * Refactored method getUserTransaction and getRemoteTransaction into getTransaction(transactionType)
	 * transactionType should be as defined in the orbionedirect.properties, The earlier version (weblogic) of this code
	 * retrieve the usertxn directly by creating a InitialCOntext() without setting anyproperties this has been changed
	 * to create create the user transaction based on the jndiurl,provider,jndiname as defined in the
	 * orbionedirect.properties by doing this this method can be used in any app server just by changing the config.
	 * 
	 * @param transactionType, the types are REMOTE_TXN_NAME for remote transaction and USER_TXN_NAME for user
	 *            transaction
	 * @return UserTransaction, a valid usertransaction for the transactionType or null, if any exception occurs
	 */
	private static UserTransaction getTransaction(String transactionType)
	{
		UserTransaction userTxn = null;
		String cmName = "DataManager:getTransaction";
		logger.ctinfo("CTDBL00001", cmName);

		try
		{
			ConfigurationManager confMngr = ConfigurationManager.getInstance();
			DBConfigurationDescriptor dbDesc = confMngr.getDBDescriptor();
			String JNDIName = "";
			if ("REMOTE_TXN_NAME".equals(transactionType))
			{
				JNDIName = dbDesc.getCtremotetxnjndiname();
			} else if ("USER_TXN_NAME".equals(transactionType))
			{
				JNDIName = dbDesc.getCtusertxnjndiname();
			}

			logger.ctdebug("CTDBL00002", JNDIName);

			InitialContext ic = new InitialContext();
			userTxn = (UserTransaction) ic.lookup(JNDIName);

		} catch (Exception e)
		{
			logger.cterror("CTDBL00003", e, transactionType);
		}
		return userTxn;
	}

	/**
	 * Resets the connection
	 * 
	 * @exception SQLException if a database access error occurs
	 * @return The boolean variable
	 */

	protected boolean resetConnection() throws SQLException
	{
		m_dbConnection.setAutoCommit(true);
		m_dbConnection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
		return true;
	}

	/**
	 * Method returns the connection object
	 * 
	 * @return the connection Object
	 * @throws SQLException
	 */
	public Connection getConnection() throws SQLException
	{
		return m_dbConnection;
	}

	/**
	 * Method sets the connection object
	 * 
	 * @param dbConnection
	 * @exception SQLException if a database access error occurs
	 */

	public void setConnection(Connection dbConnection) throws SQLException
	{
		this.m_dbConnection = dbConnection;
	}

	/**
	 * Starts a new transaction with commit set to false
	 * 
	 * @exception SQLException if a database access error occurs
	 */

	public void startTransaction() throws SQLException
	{
		m_dbConnection.setAutoCommit(false);
		m_dbConnection.rollback();
		m_dbConnection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
	}

	/**
	 * Drops all changes made since the previous commit/rollback and releases any database locks currently held by this
	 * Connection.
	 * 
	 * @exception SQLException if a database access error occurs
	 */

	public void abortTransaction() throws SQLException
	{
		m_dbConnection.rollback();
		this.endTransaction();
	}

	/**
	 * Releases a Connection's database and JDBC resources immediately instead of waiting for them to be automatically
	 * released.
	 * 
	 * @exception SQLException if a database access error occurs
	 */

	public void endTransaction() throws SQLException
	{
		m_dbConnection.close();
	}

	/**
	 * Makes all changes made since the previous commit/rollback permanent and releases any database locks currently
	 * held by the Connection
	 * 
	 * @exception SQLException if database error occurs
	 */

	public void commitTransaction() throws SQLException
	{
		m_dbConnection.setAutoCommit(false);
		m_dbConnection.commit();
	}

	/**
	 * Drops all changes made since the previous commit/rollback and releases any database locks currently held by this
	 * Connection
	 * 
	 * @exception SQLException if Description : This Constructor sets .
	 */

	public void rollBackTransaction() throws SQLException
	{
		m_dbConnection.rollback();
	}

	/**
	 * Replaces the SQL Query that is delmited by "###" to "?" that is suitable to form a prepared statement
	 * 
	 * @param SQL_QUERY SQL query
	 * @return The String object Description : This Constructor sets .
	 */

	public String getProductQuery(String SQL_QUERY)
	{
		String cmName = "DataManager:getProductQuery";
		logger.ctinfo("CTDBL00001", cmName);
		String UNPARSED_SQL_QUERY = SQL_QUERY;
		StringTokenizer st = new StringTokenizer(UNPARSED_SQL_QUERY, "#");
		int count = 0;
		String str1[] = new String[st.countTokens()];

		while (st.hasMoreTokens())
		{
			count += 1;
			str1[count - 1] = st.nextToken();
		}
		StringBuffer input = new StringBuffer(UNPARSED_SQL_QUERY);

		for (int i = 1; i < str1.length; i += 2)
		{
			String label = "#" + str1[i] + "#";
			int stPos = UNPARSED_SQL_QUERY.indexOf("#");
			int endPos = UNPARSED_SQL_QUERY.indexOf("#") + label.length();
			input.replace(stPos, endPos, "?");
			UNPARSED_SQL_QUERY = new String(input);
			stPos = 0;
			endPos = 0;
			label = "";
		}
		return UNPARSED_SQL_QUERY;
	}

	/**
	 * Parses the SQL query, picks the strings that are Delimited by "###" eg(###GCIN###) and compares this String with
	 * the key in the Hashtable. The values for the corresponding key are added to a Vector
	 * 
	 * @param UNPARSED_SQL_QUERY the SQL query
	 * @param hshAccount Hashtable containing the Delimited String as key and its Value
	 * @return The Vector object
	 * @throws Exception throws while creating Prepared statement
	 */
	public PreparedStatement getProductVector(String UNPARSED_SQL_QUERY, Hashtable<String, String> hshAccount)
			throws Exception
	{

		String cmName = "DataManager:getProductVector";
		logger.ctinfo("CTDBL00001", cmName);
		Vector<Object> vect_Account = new Vector<Object>();
		StringTokenizer st = new StringTokenizer(UNPARSED_SQL_QUERY, "#");
		int count = 0;
		String str1[] = new String[st.countTokens()];

		while (st.hasMoreTokens())
		{
			count += 1;
			str1[count - 1] = st.nextToken();
		}

		for (int i = 1; i < str1.length; i += 2)
		{
			vect_Account.addElement(hshAccount.get(str1[i]));
		}

		UNPARSED_SQL_QUERY = getProductQuery(UNPARSED_SQL_QUERY);

		return prepareStatement(UNPARSED_SQL_QUERY, vect_Account);
	}

	/**
	 * This method is used to create prepared statement for an un parsed sql query
	 * 
	 * @param UNPARSED_SQL_QUERY
	 * @param hshAccount
	 * @return prepareStatement
	 * @throws Exception
	 */

	public PreparedStatement getProductVector(String UNPARSED_SQL_QUERY, HashMap<String, String> hshAccount)
			throws Exception
	{

		String cmName = "DataManager:getProductVector";
		logger.ctinfo("CTDBL00001", cmName);
		Vector<Object> vect_Account = new Vector<Object>();
		StringTokenizer st = new StringTokenizer(UNPARSED_SQL_QUERY, "#");
		int count = 0;
		String str1[] = new String[st.countTokens()];

		while (st.hasMoreTokens())
		{
			count += 1;
			str1[count - 1] = st.nextToken();
		}

		for (int i = 1; i < str1.length; i += 2)
		{
			vect_Account.addElement(hshAccount.get(str1[i]));
		}

		UNPARSED_SQL_QUERY = getProductQuery(UNPARSED_SQL_QUERY);

		return prepareStatement(UNPARSED_SQL_QUERY, vect_Account);
	}

	/**
	 * Creates a PreparedStatement setting the Values from the Vector to the Query.
	 * 
	 * @param sql SQL Query
	 * @param arguments
	 * @exception SQLException if a database access error occurs
	 * @return The PreparedStatement object
	 */

	public PreparedStatement prepareStatement(String sql, Vector<Object> arguments) throws SQLException
	{
		String cmName = "DataManager:prepareStatement";
		logger.ctinfo("CTDBL00001", cmName);
		PreparedStatement ps;
		ps = getConnection().prepareStatement(sql, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

		for (int i = 0, x = 1; i < arguments.size(); i++, x++)
		{
			Object o = arguments.elementAt(i);

			if (o instanceof String)
			{
				// The database cannot handle empty strings, so we convert
				// them to NULL.
				if ("".equals(o))
				{
					o = " ";
				}
				ps.setString(x, (String) o);
			} else if (o instanceof java.sql.Date)
			{
				ps.setDate(x, (java.sql.Date) o);
			} else if (o instanceof java.util.Date)
			{
				ps.setDate(x, new java.sql.Date(((java.util.Date) o).getTime()));
			} else if (o instanceof java.sql.Timestamp)
			{
				ps.setTimestamp(x, (java.sql.Timestamp) o);
			} else if (o instanceof Integer)
			{
				ps.setInt(x, ((Integer) o).intValue());
			} else if (o instanceof Double)
			{
				ps.setDouble(x, ((Double) o).doubleValue());
			} else if (o instanceof Float)
			{
				ps.setFloat(x, ((Float) o).floatValue());
			} else if (o instanceof Long)
			{
				ps.setLong(x, ((Long) o).longValue());
			} else if (o instanceof Short)
				ps.setShort(x, ((Short) o).shortValue());
			else
			{
			}
		}
		return ps;
	}

	/**
	 * Constructs a PreparedStatement Object.
	 * 
	 * @param templateSql SQL Query
	 * @exception SQLException - if a database access error occurs
	 * @return The PreparedStatement object
	 */

	public PreparedStatement getPreparedStatment(String templateSql) throws SQLException
	{
		return getConnection().prepareStatement(templateSql);
	}

	/**
	 * Executes a SQL statement that returns a single ResultSet.
	 * 
	 * @param prep Prepared Statement
	 * @return The ResultSet object
	 */

	public ResultSet executeQuery(PreparedStatement prep)
	{
		try
		{
			return prep.executeQuery();
		} catch (Exception e)
		{
			logger.cterror("CTDBL00004", e);
			return null;
		}
	}

	/**
	 * Releases this ResultSet object's database and JDBC resources immediately instead of waiting for this to happen
	 * when it is automatically closed.
	 * 
	 * @param rs The ResultSet object Description : This Constructor sets .
	 */

	public void closeResultSet(ResultSet rs)
	{
		try
		{
			if (rs != null)
				rs.close();
		} catch (Exception e)
		{
			logger.cterror("CTDBL00005", e);
		}
	}

	/**
	 * Releases this Statement object's database and JDBC resources immediately instead of waiting for this to happen
	 * when it is automatically closed.
	 * 
	 * @param ps The PreparedStatement object Description : This Constructor sets .
	 */

	public void closePreparedStatement(PreparedStatement ps)
	{
		try
		{
			if (ps != null)
				ps.close();

		} catch (Exception e)
		{
			logger.cterror("CTDBL00006", e);
		}
	}

	/**
	 * Makes all changes made since the previous commit/rollback permanent and releases any database locks currently
	 * held by the Connection.
	 * 
	 * @exception SQLException if a database access error occurs
	 */
	public void closeConnection() throws SQLException
	{
		if (null != m_dbConnection && !m_dbConnection.isClosed())
		{
			m_dbConnection.close();
			m_dbConnection = null;
		}
	}

	/**
	 * Constructs a Statement Object.
	 * 
	 * @exception SQLException - if a database access error occurs
	 * @return The Statement object
	 */

	public Statement getScrollableStatement() throws SQLException
	{
		return m_dbConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
	}

	/**
	 * Constructs a Statement Object.
	 * 
	 * @exception SQLException - if a database access error occurs
	 * @return The Statement object
	 */

	public Statement getStatement() throws SQLException
	{
		return m_dbConnection.createStatement();
	}

	/**
	 * Constructs a PreparedStatement Object.
	 * 
	 * @param templateSql SQL Query
	 * @exception SQLException - if a database access error occurs
	 * @return The PreparedStatement object
	 */

	public PreparedStatement getScrollablePreparedStatment(String templateSql) throws SQLException
	{
		return m_dbConnection.prepareStatement(templateSql, ResultSet.TYPE_SCROLL_INSENSITIVE,
				ResultSet.CONCUR_READ_ONLY);
	}

}

class DataSourceCache
{
	private static Logger logger = Logger.getLogger(DataSourceCache.class);
	ConfigurationManager configMgr = null;
	private static DataSource dataSource = loadDataSource((ConfigurationManager.getInstance()).getDBDescriptor()
			.getImplDataSourceName());

	/**
	 * Default Constructor
	 */
	private DataSourceCache()
	{
	}

	/**
	 * Return Data source name
	 * 
	 * @return dataSource
	 */
	public static DataSource getDataSource()
	{

		if (dataSource == null)
			dataSource = loadDataSource((ConfigurationManager.getInstance()).getDBDescriptor().getImplDataSourceName());
		return dataSource;
	}

	/**
	 * Return Data source name
	 * 
	 * @param jndiName
	 * @return dataSource
	 */
	private static DataSource loadDataSource(String jndiName)
	{
		String cmName = "DataSourceCache:loadDataSource";
		logger.ctinfo("CTDBL00001", cmName);
		DataSource aDataSource = null;
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			Properties propertiesMap = new Properties();
			propertiesMap.put(Context.INITIAL_CONTEXT_FACTORY, configMgr.getDBDescriptor().getJndiFactory());
			propertiesMap.put(Context.PROVIDER_URL, configMgr.getDBDescriptor().getProviderUrl());
			InitialContext ic = new InitialContext(propertiesMap);
			aDataSource = (javax.sql.DataSource) ic.lookup(jndiName);
		} catch (Exception e)
		{
			logger.cterror("CTDBL00007", e);
		}

		return aDataSource;
	}
}

class RemoteLookupDataSourceCache
{
	private static Logger logger = Logger.getLogger(RemoteLookupDataSourceCache.class);
	private static DataSource dataSource = loadDataSource((ConfigurationManager.getInstance()).getDBDescriptor()
			.getImplDataSourceName());

	/**
	 * Default Constructor
	 */
	private RemoteLookupDataSourceCache()
	{
	}

	/**
	 * this method is used to get the datasource
	 * 
	 * @return datasource
	 */
	public static DataSource getDataSource()
	{
		if (dataSource == null)
		{
			dataSource = loadDataSource((ConfigurationManager.getInstance()).getDBDescriptor().getImplDataSourceName());
		}

		return dataSource;
	}

	/**
	 * Returns Data source name
	 * 
	 * @param jndiName
	 * @return dataSource
	 */
	private static DataSource loadDataSource(String jndiName)
	{
		String cmName = "RemoteLookupDataSourceCache:loadDataSource";
		logger.ctinfo("CTDBL00001", cmName);
		DataSource remoteDataSource = null;
		try
		{
			Context ic = getInitialContext();
			remoteDataSource = (javax.sql.DataSource) ic.lookup(jndiName);
		} catch (Exception e)
		{
			logger.cterror("CTDBL00007", e);
		}

		return remoteDataSource;
	}

	/**
	 * Creates an InitialContext
	 * 
	 * @exception NamingException
	 * @return Context
	 */
	private static Context getInitialContext() throws NamingException
	{
		String cmName = "RemoteLookupDataSourceCache:getInitialContext";
		logger.ctinfo("CTDBL00001", cmName);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		Properties propertiesMap = new Properties();
		propertiesMap.put(Context.INITIAL_CONTEXT_FACTORY, configMgr.getDBDescriptor().getJndiFactory());
		propertiesMap.put(Context.PROVIDER_URL, configMgr.getDBDescriptor().getProviderUrl());
		Context initCtx = new InitialContext(propertiesMap);
		/**
		 * The below configuration is for Tomcat server.
		 */
		Context envCtx = (Context) initCtx.lookup("java:comp/env");

		/**
		 * The commented block is for configuring Jboss server
		 */
		/**
		 * java.util.Hashtable props = new java.util.Hashtable(); props.put("java.naming.factory.initial",
		 * DataManager.FACTORY_INITIAL); props.put("java.naming.provider.url", DataManager.PROVIDER_URL);
		 */
		return initCtx;
	}

}
