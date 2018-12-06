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

package com.intellectdesign.canvas.logging;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;

import org.apache.log4j.FileAppender;
import org.apache.log4j.Layout;
import org.apache.log4j.helpers.CountingQuietWriter;
import org.apache.log4j.helpers.LogLog;
import org.apache.log4j.helpers.OptionConverter;
import org.apache.log4j.spi.LoggingEvent;

/**
 * This class is used to create an appender pattern for intellect logging.
 * 
 * Based on the roll over model set in the configuration file currently supports 2 models 1. CREATENEW - current logging
 * would happen in the file name having the current date pattern and higher rolling index value. (i.e., logging would
 * happen by creating a new file) 2. BACKUPOLD - current logging would always happen in file name without date pattern
 * and rolling index on roll over the current file would be made as a backup with a date pattern and index included in
 * it.
 * 
 * The class extends FileAppender class of log4j. This appender receives the following attributes from the configuration
 * file 1. layout, 2. appender file, 3. maxFileSize, 4. datePattern, 5. suffixOrPrefix 6. patternSeparator 7.
 * maxBackupIndex 8. rolloverModel
 * 
 * 'suffixOrPrefix' attribute: the appender expects the following 2 options - SUFFIX - PREFIX based on which the
 * appender will create the log file name in the following format or pattern a.
 * <filename><patternSeparator><datePattern><patternSeparator><rollingIndex>.<extension> if the suffixOrPrefix option is
 * 'PREFIX' Example : serverLogs-2010-03-26-01.log b.
 * <filename>.<extension><patternSeparator><datePattern><patternSeparator><rollingIndex> if the suffixOrPrefix option is
 * 'SUFFIX' Example : serverLogs.log-2010-03-26-01 and
 * 
 * 'datePattern' attribute: the appender expects date and time pattern as listed below which actually decides on the
 * Roll over period whether to be monthly, weekly, daily etc. And the datePattern also decides on the format of date to
 * be appended in the file name construction - yyyy-MM >> Roll over at the beginning of each month - yyyy-ww >> Roll
 * over at the first day of each week. The first day of the week depends on the locale. - yyyy-MM-dd >> Roll over at
 * midnight each day. - yyyy-MM-dd-a >> Roll over at midnight and midday of each day. - yyyy-MM-dd-HH >> Roll over at
 * the top of every hour. - yyyy-MM-dd-HH-mm >> Roll over at the beginning of every minute.
 * 
 * 'maxFileSize' attribute: the appender expects size value in "KB", "MB" or "GB" It actually decides on the maximum
 * file size of a log file considering the rollover period. For a period if the file size exceeds the set value a new
 * file with same period would be generated with rolling index incremented by one.
 * 
 * 'patternSeparator' attribute: the appender expects any character except ':'which actually separates the date pattern
 * in the file name with other components of the file name
 * 
 * 'maxBackupIndex' attribute: applicable only in case if roll over model is set as 'BACKUPOLD'. this value decides on
 * the maximum number of back up files that could be created for a particular date pattern set.
 * 
 * 'rolloverModel' attribute: expects one of the following 2 roll over models currently supported CREATENEW, BACKUPOLD,
 * default being 'CREATENEW'
 * 
 * 
 * @version 1.0
 */
public class DailyRollingFileAndSizeAppender extends FileAppender
{
	/**
	 * Returns the value of the <b>MaxBackupIndex</b> option.
	 */

	public int getMaxBackupIndex()
	{
		return maxBackupIndex;
	}

	/**
	 * 
	 * Set the maximum number of backup files to keep around.
	 * <p>
	 * The <b>MaxBackupIndex</b> option determines how many backup files are kept before the oldest is erased. This
	 * option takes a positive integer value. If set to zero, then there will be no backup files and the log file will
	 * be truncated when it reaches <code>MaxFileSize</code>.
	 * 
	 * @param maxBackups
	 */

	public void setMaxBackupIndex(int maxBackups)
	{
		this.maxBackupIndex = maxBackups;
	}

	/**
	 * Sets the rolloverModel option, which decides on the rollover model if configured in the configuration file
	 * (log4j.properties).
	 * 
	 * @param rolloverModel from the configuration file (log4j.properties).
	 */

	public void setRolloverModel(String rolloverModel)
	{
		if (ROLLMODEL1.equals(rolloverModel) || ROLLMODEL2.equals(rolloverModel))
		{
			this.rolloverModel = rolloverModel;
		} else
		{
			LogLog.warn("an unsupported property has been set in the configuration file for appender [" + name + "].");
			this.rolloverModel = ROLLMODEL1;
		}

	}

	/**
	 * Gets the rolloverModel that helps to decide on the rollover model
	 * 
	 * @return: The rolloverModel of String type
	 */

	public String getRolloverModel()
	{
		return this.rolloverModel;
	}

	/**
	 * Sets the datePattern if configured in the configuration file (log4j.properties). which also determines the
	 * rolling period to be daily, monthly or weekly based on the input.
	 * 
	 * @param datePattern from the configuration file (log4j.properties).
	 */

	public void setDatePattern(String datePattern)
	{
		this.datePattern = datePattern;
	}

	/**
	 * Gets the datePattern that helps to decides on the roll over period and format of the date time stamp of the log
	 * file name.
	 * 
	 * @return: The datePattern of String type
	 */

	public String getDatePattern()
	{
		return datePattern;
	}

	/**
	 * Sets the suffixOrPrefix option, which decides on the location of the date/time stamp plus rolling index in
	 * reference to the .log extension if configured in the configuration file (log4j.properties).
	 * 
	 * @param suffixOrPrefix from the configuration file (log4j.properties).
	 */

	public void setSuffixOrPrefix(String suffixOrPrefix)
	{
		if (suffixOrPrefix.equals(SUFFIXCONST) || suffixOrPrefix.equals(PREFIXCONST))
		{
			this.suffixOrPrefix = suffixOrPrefix;
		} else
		{
			LogLog.warn("an unsupported property has been set in the configuration file for appender [" + name + "].");
			this.suffixOrPrefix = SUFFIXCONST;
		}

	}

	/**
	 * Gets the suffixOrPrefix that helps to decide on the location of the date/time stamp plus rolling index in
	 * reference to the .log extension
	 * 
	 * @return: The suffixOrPrefix of String type
	 */

	public String getSuffixOrPrefix()
	{
		return suffixOrPrefix;
	}

	/**
	 * Sets the separator if configured in the configuration file (log4j.properties).
	 * 
	 * @param separator from the configuration file (log4j.properties).
	 */

	public void setPatternSeparator(String timestampSeparator)
	{
		this.patternSeparator = timestampSeparator;
	}

	/**
	 * Get the separator that separates the date time stamp from the remaining parts of the file name.
	 * 
	 * @return: The separator of String type
	 */

	public String getPatternSeparator()
	{
		return patternSeparator;
	}

	/**
	 * Get the maximum size that the output file is allowed to reach before being rolled over to backup files.
	 * 
	 * @return: The maxFileSize file size of long type
	 */
	public long getMaximumFileSize()
	{
		return maxFileSize;
	}

	/**
	 * Set the maximum size that the output file is allowed to reach before being rolled over to backup files.
	 * 
	 * <p>
	 * In configuration files, the <b>MaxFileSize</b> option takes an long integer in the range 0 - 2^63. You can
	 * specify the value with the suffixes "KB", "MB" or "GB" so that the integer is interpreted being expressed
	 * respectively in kilobytes, megabytes or gigabytes. For example, the value "10KB" will be interpreted as 10240.
	 * 
	 * @param value - value to be set for maxFileSize
	 */
	public void setMaxFileSize(String value)
	{
		maxFileSize = OptionConverter.toFileSize(value, maxFileSize + 1);
	}

	/**
	 * The default constructor simply calls its {@link FileAppender#FileAppender parents constructor}.
	 */
	public DailyRollingFileAndSizeAppender()
	{
		super();
	}

	/**
	 * Instantiate a <code>DailyRollingFileAndSizeAppender</code> and open the file designated by <code>filename</code>.
	 * The opened filename will become the output destination for this appender given with the appender value
	 * 
	 * @param paramlayout: layout type
	 * @param filename: name of the file of type String
	 * @param append: If the append parameter is true, the file will be appended to. Otherwise, the file designated by
	 *            filename will be truncated before being opened.
	 * @throws IOException This API/logic has been take from org.apache.log4j.DailyRollingFileAppender
	 */
	public DailyRollingFileAndSizeAppender(Layout paramlayout, String filename, boolean append) throws IOException
	{
		layout = paramlayout;
		setFile(filename, append, false, bufferSize);
		activateOptions();
	}

	/**
	 * Instantiate a <code>DailyRollingFileAndSizeAppender</code> and open the file designated by <code>filename</code>.
	 * The opened filename will become the output destination for this appender given with the appender value
	 * 
	 * @param: paramlayout: layout type
	 * @param: filename: name of the file of type String
	 * @throws: IOException This API/logic has been take from org.apache.log4j.DailyRollingFileAppender
	 */
	public DailyRollingFileAndSizeAppender(Layout paramlayout, String filename) throws IOException
	{
		layout = paramlayout;
		setFile(filename, true, false, bufferSize);
		activateOptions();
	}

	/**
	 * 
	 * Sets the quiet writer being used. This method is overridden by FileAppender. This API/logic has been take from
	 * org.apache.log4j.DailyRollingFileAppender
	 * 
	 * @param writer
	 * @see org.apache.log4j.FileAppender#setQWForFiles(java.io.Writer)
	 */
	protected void setQWForFiles(Writer writer)
	{
		qw = new CountingQuietWriter(writer, errorHandler);
	}

	/**
	 * This method differentiates DailyRollingFileAndSizeAppender from its super class.Actual writing occurs here.
	 * <p>
	 * Before actually logging, this method will check whether it is time to do a roll over. If it is, it will schedule
	 * the next roll over time and then roll over.
	 * 
	 * @param Logevent when log should append This API/logic has been taken from
	 *            org.apache.log4j.DailyRollingFileAppender
	 */
	protected void subAppend(LoggingEvent event)
	{
		long currentTime = System.currentTimeMillis();
		// check time for date roll over
		if (currentTime >= nextCheck)
		{
			now.setTime(currentTime);
			nextCheck = rc.getNextCheckMillis(now);
			try
			{
				datePatternRollOver();
			} catch (IOException ioe)
			{
				LogLog.error("datePatternRollOver() failed.", ioe);
			}
		}
		super.subAppend(event);
		long size = ((CountingQuietWriter) qw).getCount();
		// check whether size has increased beyond the specified size or not
		if ((fileName != null) && size >= this.getMaximumFileSize() && size >= nextRollover)
		{
			sizeRollover();
		}
	}

	/**
	 * Overriding setFile method of a FileAppender to create file format specific to intellectOnline.It gets the latest
	 * rollingIndex for a file by help of findRecentIndex() Creates file in format
	 * filename_daystamp_rollingIndex.extension
	 * 
	 * @param fileName - The path to the log file.
	 * @param append - If true will append to fileName. Otherwise will truncate fileName.
	 * @param bufferedIO - Do we do bufferedIO?
	 * @param bufferSize - size of the buffer This API/logic has been taken from org.apache.log4j.FileAppender and
	 *            modified so as to get a rolling index on size increase beyond the specified limit and a day stamp for
	 *            each day
	 * @throws IOException
	 */
	public synchronized void setFile(String filenameSet, boolean append, boolean bufferedIO, int bufferSize)
			throws IOException
	{
		String localFileName = null;
		if (ROLLMODEL1.equals(this.getRolloverModel()))
		{
			findRecentIndex(filenameSet); // to find the recent index with current time stamp
			localFileName = constructFileName(filenameSet, rollingIndex, ""); // to construct the file name
		} else if (ROLLMODEL2.equals(this.getRolloverModel()))
		{
			localFileName = filenameSet;
		}
		super.setFile(localFileName, append, bufferedIO, bufferSize);
		fileName = filenameSet;// reset to original filename for further naming
		if (append)
		{
			File file = new File(fileName);
			((CountingQuietWriter) qw).setCount(file.length());
		}
	}

	/**
	 * This method performs the initial activation options. Calls the super method Please Refer
	 * org.apache.log4j.FileAppender.activateOptions() This API/logic has been taken from
	 * org.apache.log4j.DailyRollingFileAppender
	 */
	public void activateOptions()
	{
		super.activateOptions();
		if (this.getDatePattern() != null && fileName != null)
		{
			now.setTime(System.currentTimeMillis());
			int type = computeCheckPeriod();
			printPeriodicity(type);
			rc.setType(type);
			// Only for Roll over model 2 in order to set the scheduled file name
			if (ROLLMODEL2.equals(this.getRolloverModel()))
			{
				sdf = new SimpleDateFormat(this.getDatePattern());
				File file = new File(fileName);
				scheduledFilename = constructFileName(fileName, 1, sdf.format(new Date(file.lastModified())));
			}
		} else
		{
			LogLog.error("Either File or datePattern options are not set for appender [" + name + "].");
		}
	}

	/**
	 * This method is to log the periodicity in logger's log
	 * 
	 * @param: type, indicates when appended file has to rolled out apart from max file size exceeds This API/logic has
	 *         been taken from org.apache.log4j.DailyRollingFileAppender
	 */
	public void printPeriodicity(int type)
	{
		switch (type)
		{
		case TOP_OF_MINUTE:
			LogLog.debug("Appender [" + name + "] to be rolled every minute.");
			break;
		case TOP_OF_HOUR:
			LogLog.debug("Appender [" + name + "] to be rolled on top of every hour.");
			break;
		case HALF_DAY:
			LogLog.debug("Appender [" + name + "] to be rolled at midday and midnight.");
			break;
		case TOP_OF_DAY:
			LogLog.debug("Appender [" + name + "] to be rolled at midnight.");
			break;
		case TOP_OF_WEEK:
			LogLog.debug("Appender [" + name + "] to be rolled at start of week.");
			break;
		case TOP_OF_MONTH:
			LogLog.debug("Appender [" + name + "] to be rolled at start of every month.");
			break;
		default:
			LogLog.warn("Unknown periodicity for appender [" + name + "].");
		}
	}

	/**
	 * This method computes the roll over period by looping over the periods, starting with the shortest, and stopping
	 * when the r0 is different from from r1, where r0 is the epoch formatted according the datePattern (supplied by the
	 * user) and r1 is the epoch+nextMillis(type) formatted according to datePattern. All date formatting is done in GMT
	 * and not local format because the test logic is based on comparisons relative to 1970-01-01 00:00:00 GMT (the
	 * epoch). (Refer: org.apache.log4j.DailyRollingFileAppender.computeCheckPeriod()
	 * 
	 * @return : type, returns the int value when appended file has to rolled out, apart from exceeds max file size This
	 *         API/Logic has been taken from org.apache.log4j.DailyRollingFileAppender.computeCheckPeriod()
	 */
	public int computeCheckPeriod()
	{
		RollingCalendar rollingCalendar = new RollingCalendar(gmtTimeZone, Locale.ENGLISH);
		// set sate to 1970-01-01 00:00:00 GMT
		Date epoch = new Date(0);

		if (this.getDatePattern() != null)
		{
			SimpleDateFormat simpleDateFormat;
			String r0;
			String r1;
			Date nextDate;
			for (int type = TOP_OF_MINUTE; type <= TOP_OF_MONTH; type++)
			{
				simpleDateFormat = new SimpleDateFormat(this.getDatePattern());
				simpleDateFormat.setTimeZone(gmtTimeZone); // do all date formatting in GMT
				r0 = simpleDateFormat.format(epoch);
				rollingCalendar.setType(type);
				nextDate = new Date(rollingCalendar.getNextCheckMillis(epoch));
				r1 = simpleDateFormat.format(nextDate);
				if (r0 != null && r1 != null && !r0.equals(r1))
				{
					return type;
				}
			}
		}
		return TOP_OF_TROUBLE; // Deliberately head for trouble...
	}

	/**
	 * Given a filename this method returns filename without extension Ex: if you are passed the file name like
	 * ServerLog.log then this method will return only file name
	 * 
	 * @param targetFile - file name with extension
	 * @return Returns file name with out extension
	 */
	private String retrieveFileNameWithOutExt(String targetFile)
	{
		for (int index = targetFile.length(); index > 0; index--)
		{
			if (targetFile.charAt(index - 1) == '.')
			{
				targetFile = targetFile.substring(0, index - 1);
				break;
			}
		}
		return targetFile;
	}

	/**
	 * Given a filename this method returns extension.If no extension returns empty String Ex: if you are passed the
	 * file name like ServerLog.log then this method will return only extension
	 * 
	 * @param targetFile - file name with extension
	 * @return Returns extension with out file name
	 */
	private String retrieveFileExtension(String targetFile)
	{
		String result = "";
		for (int index = targetFile.length(); index > 0; index--)
		{
			if (targetFile.charAt(index - 1) == '.')
			{
				result = targetFile.substring(index, targetFile.length());
				break;
			}
		}
		if (result.equals(targetFile))
			return "";
		return result;
	}

	/**
	 * Rollover the current file to a new file considering the size of the current file after an event is logged
	 */

	public void sizeRollover()
	{
		if (ROLLMODEL1.equals(this.getRolloverModel()))
		{
			rollingIndex = rollingIndex + 1;
			try
			{
				setFile(fileName, true, bufferedIO, bufferSize);// Creates new file with new date stamp
			} catch (IOException e)
			{
				LogLog.error("SetFile(" + fileName + ", false) call failed.", e);
			}
		} else if (ROLLMODEL2.equals(this.getRolloverModel()))
		{
			File target;
			File file;
			if (qw != null)
			{
				long size = ((CountingQuietWriter) qw).getCount();
				LogLog.debug("rolling over count=" + size);
				// if operation fails, do not roll again until
				// maxFileSize more bytes are written
				nextRollover = size + maxFileSize;
			}
			LogLog.debug("maxBackupIndex=" + this.getMaxBackupIndex());
			boolean renameSucceeded = true;
			// If maxBackups <= 0, then there is no file renaming to be done.
			if (this.getMaxBackupIndex() > 0)
			{
				// Delete the oldest file
				file = new File(constructFileName(fileName, this.getMaxBackupIndex(), ""));
				if (file.exists())
					renameSucceeded = file.delete();

				// Map {(maxBackupIndex - 1), ..., 2, 1} to {maxBackupIndex, ..., 3, 2}
				for (int i = this.getMaxBackupIndex() - 1; i >= 1 && renameSucceeded; i--)
				{
					file = new File(constructFileName(fileName, i, ""));
					if (file.exists())
					{
						target = new File(constructFileName(fileName, i + 1, ""));
						LogLog.debug("Renaming file " + file + " to " + target);
						renameSucceeded = file.renameTo(target);
					}
				}

				if (renameSucceeded)
				{
					target = new File(constructFileName(fileName, 1, ""));
					this.closeFile();
					file = new File(fileName);
					LogLog.debug("Renaming file " + file + " to " + target);
					renameSucceeded = file.renameTo(target);
					//
					// if file rename failed, reopen file with append = true
					//
					if (!renameSucceeded)
					{
						try
						{
							this.setFile(fileName, true, bufferedIO, bufferSize);
						} catch (IOException e)
						{
							LogLog.error("setFile(" + fileName + ", true) call failed.", e);
						}
					}
				}
			}
			//
			// if all renames were successful, then
			//
			if (renameSucceeded)
			{
				try
				{
					// This will also close the file. This is OK since multiple
					// close operations are safe.
					this.setFile(fileName, false, bufferedIO, bufferSize);
					nextRollover = 0;
				} catch (IOException e)
				{
					LogLog.error("setFile(" + fileName + ", false) call failed.", e);
				}
			}
		}
	}

	/**
	 * Rollover the current file to a new file considering the date pattern before an event is logged
	 * 
	 * @throws IOException
	 */
	public void datePatternRollOver() throws IOException
	{
		if (ROLLMODEL1.equals(this.getRolloverModel()))
		{
			try
			{
				setFile(fileName, true, bufferedIO, bufferSize);// Creates new file with new date stamp
			} catch (IOException e)
			{
				LogLog.error("SetFile(" + fileName + ", false) call failed.", e);
			}
		} else if (ROLLMODEL2.equals(this.getRolloverModel()))
		{

			/* Compute filename, but only if datePattern is specified */
			if (this.getDatePattern() == null)
			{
				errorHandler.error("Missing DatePattern option in rollOver().");
				return;
			}
			sdf = new SimpleDateFormat(this.getDatePattern());
			String datedFilename = constructFileName(fileName, 1, sdf.format(now));
			// It is too early to roll over because we are still within the
			// bounds of the current interval. Rollover will occur once the
			// next interval is reached.
			if (scheduledFilename.equals(datedFilename))
			{
				return;
			}
			// close current file, and rename it to scheduledFilename
			this.closeFile();

			File target = new File(scheduledFilename);
			if (target.exists())
			{
				File tempTarget;
				File actFile;
				File file = new File(fileName);
				LogLog.debug("maxBackupIndex=" + this.getMaxBackupIndex());
				boolean renameSucceeded = true;
				// If maxBackups <= 0, then there is no file renaming to be done.
				if (this.getMaxBackupIndex() > 0)
				{
					// Delete the oldest file
					actFile = new File(constructFileName(fileName, this.getMaxBackupIndex(),
							sdf.format(new Date(file.lastModified()))));
					if (actFile.exists())
						renameSucceeded = actFile.delete();

					// Map {(maxBackupIndex - 1), ..., 2, 1} to {maxBackupIndex, ..., 3, 2}
					for (int i = this.getMaxBackupIndex() - 1; i >= 1 && renameSucceeded; i--)
					{
						actFile = new File(constructFileName(fileName, i, sdf.format(new Date(file.lastModified()))));
						if (actFile.exists())
						{
							tempTarget = new File(constructFileName(fileName, i + 1,
									sdf.format(new Date(file.lastModified()))));
							LogLog.debug("Renaming file " + actFile + " to " + tempTarget);
							renameSucceeded = actFile.renameTo(tempTarget);
						}
					}

					if (renameSucceeded)
					{
						tempTarget = new File(constructFileName(fileName, 1, sdf.format(new Date(file.lastModified()))));

						this.closeFile();

						file = new File(fileName);
						LogLog.debug("Renaming file " + file + " to " + tempTarget);
						renameSucceeded = file.renameTo(tempTarget);
						//
						// if file rename failed, reopen file with append = true
						//
						if (!renameSucceeded)
						{
							try
							{
								this.setFile(fileName, true, bufferedIO, bufferSize);
							} catch (IOException e)
							{
								LogLog.error("setFile(" + fileName + ", true) call failed.", e);
							}
						}
					}
				}
				//
				// if all renames were successful, then
				//
				if (renameSucceeded)
				{
					try
					{
						// This will also close the file. This is OK since multiple
						// close operations are safe.
						this.setFile(fileName, false, bufferedIO, bufferSize);
					} catch (IOException e)
					{
						LogLog.error("setFile(" + fileName + ", false) call failed.", e);
					}
				}
			} else
			{
				File file = new File(fileName);
				boolean result = file.renameTo(target);
				if (result)
				{
					LogLog.debug(fileName + " -> " + scheduledFilename);
				} else
				{
					LogLog.error("Failed to rename [" + fileName + "] to [" + scheduledFilename + "].");
				}

				try
				{
					// This will also close the file. This is OK since multiple
					// close operations are safe.
					this.setFile(fileName, false, this.bufferedIO, this.bufferSize);
				} catch (IOException e)
				{
					errorHandler.error("setFile(" + fileName + ", false) call failed.");
				}
			}
			scheduledFilename = datedFilename;
		}
	}

	/**
	 * This method is to get the rollingIndex for the latest file formed with the same timestamp. first it will change
	 * given file name by appending current time stamp and <code>index</code> value. i.e if ServerLog.log is the given
	 * as file name then file name will changes to ServerLog_03Apr2007_1.log, then checks weather named file exists or
	 * not, if exists then continues the loop, till file not exist, for suppose Server_03Apr2007_10.log is not exist
	 * means, rest 9 versions are existed in file system, Then current rollover index is 10, it will assigns to
	 * rollingIndex
	 * 
	 * @param : filename - Name of the log file
	 */
	private void findRecentIndex(String filename)
	{
		File file = null;// new File(filename);
		long fileSize = 0;
		int presentIndex = 1;
		/** This loop typically used to find the latest rollover index; */
		for (int index = 1;; index++)
		{
			String checkFile = constructFileName(filename, index, "");
			file = new File(checkFile);

			if (file.exists())
			{
				fileSize = file.length();
				presentIndex = index;
				continue;
			} else
			{
				if (fileSize >= this.getMaximumFileSize())// checks whether the earlier file has exceeded size limit
				{
					rollingIndex = index;// If Yes, then new file will have higher rollingIndex
				} else
				{
					rollingIndex = presentIndex;// If No, then data will append to existing file
				}
				break;
			}
		}
	}

	/**
	 * This method is for parsing of filename .i.e, attach the day stamp and rolling index to the filename. If there is
	 * an extension then the extension should be separated then day stamp and backup index should be attached to the
	 * filename ,then the extension. Ex: if the file name is c:\S\applogs\ServerLog.log, then this method will parse
	 * that to c:\S\applogs\ServerLog_20070403_21.log In that 20070403(yyyyMMdd) is current time stamp, then rolling
	 * index,default rolling index is 1 timestampSeparator
	 * 
	 * @param filename - name of the log file which will parse
	 * @param index - rolling index of the file name
	 * @param timestamp
	 * @return tempFileName - returns appended file name
	 */
	private String constructFileName(String filename, int index, String timestamp)
	{

		StringBuffer tempFileName = new StringBuffer();
		if (null == timestamp || "".equals(timestamp))
		{
			SimpleDateFormat currentDate = new SimpleDateFormat(this.getDatePattern());
			timestamp = currentDate.format(new Date());
		}
		File file = new File(filename);
		String absFile = file.getName();
		String absPath = file.getParent();
		String filenameFirstPart = absFile;
		String ext = "";
		if (this.getSuffixOrPrefix().equals(PREFIXCONST))
		{
			filenameFirstPart = retrieveFileNameWithOutExt(absFile);
			ext = retrieveFileExtension(absFile);
		}
		String appender = ext.equals("") ? "" : ".";
		tempFileName.append(absPath);
		tempFileName.append(File.separatorChar);
		tempFileName.append(filenameFirstPart);
		tempFileName.append(this.getPatternSeparator());
		tempFileName.append(timestamp);
		tempFileName.append(this.getPatternSeparator());
		tempFileName.append(index < 10 ? "0" + index : index);
		if (this.getSuffixOrPrefix().equals(PREFIXCONST))
		{
			tempFileName.append(appender);
			tempFileName.append(ext);
		}
		return tempFileName.toString();

	}

	/**
	 * It holds server status, when new instance being created for this class then I'm assuming server is restarted.
	 * That time I'm changing value to TRUE from FALSE in constructor
	 */
	/** The gmtTimeZone is used only in computeCheckPeriod() method. */
	static final TimeZone gmtTimeZone = TimeZone.getTimeZone("GMT");
	static final int TOP_OF_TROUBLE = -1;
	static final int TOP_OF_MINUTE = 0;
	static final int TOP_OF_HOUR = 1;
	static final int HALF_DAY = 2;
	static final int TOP_OF_DAY = 3;
	static final int TOP_OF_WEEK = 4;
	static final int TOP_OF_MONTH = 5;
	protected long maxFileSize = 10 * 1024 * 1024; // Default Maximum file size is 10MB
	protected String datePattern = "ddMMMyyyy"; // Default datePattern
	protected String suffixOrPrefix = SUFFIXCONST; // Default Suffix Or Prefix option
	protected String patternSeparator = "_"; // Default Separator
	protected String rolloverModel = "CREATENEW"; // Default roll over model
	private static int rollingIndex = 1; // index specified for the backup file
	/** The next time we estimate a roll over should occur. */
	private long nextCheck = System.currentTimeMillis() - 1;
	private RollingCalendar rc = new RollingCalendar();
	private Date now = new Date();
	static final String SUFFIXCONST = "SUFFIX";
	static final String PREFIXCONST = "PREFIX";
	static final String ROLLMODEL1 = "CREATENEW";
	static final String ROLLMODEL2 = "BACKUPOLD";
	private long nextRollover = 0;
	protected int maxBackupIndex = 100; // Default roll over model
	private String scheduledFilename;
	SimpleDateFormat sdf;

}

/**
 * RollingCalendar is a helper class to DailyRollingFileAndSizeAppender. Given a periodicity type and the current time,
 * it computes the start of the next interval. This class has been taken from org.apache.log4j.DailyRollingFileAppender
 */
class RollingCalendar extends GregorianCalendar
{
	/**
	 * Default implementation of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;
	private int type = DailyRollingFileAndSizeAppender.TOP_OF_TROUBLE;

	/**
	 * Default constructor does nothing, it simply calls super class constructor
	 * 
	 * @see java.util.GregorianCalendar
	 */
	RollingCalendar()
	{
		super();
	}

	/**
	 * This constructor also calls super class constructor with given values
	 * 
	 * @param zone - the given time zone.
	 * @param aLocale - the given locale.
	 */
	RollingCalendar(TimeZone tz, Locale locale)
	{
		super(tz, locale);
	}

	/**
	 * sets the given given a periodicity type
	 * 
	 * @param paramtype - periodicity type
	 */
	public void setType(int paramtype)
	{
		type = paramtype;
	}

	/**
	 * Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this <tt>Date</tt> object.
	 * 
	 * @param now
	 * @return the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this date.
	 */
	public long getNextCheckMillis(Date now)
	{
		return getNextCheckDate(now).getTime();
	}

	/**
	 * This method typically checks periodicity type and Adds the specified (signed) amount of time to the given time
	 * field, based on the calendar's rules.
	 * 
	 * @param now
	 * @return Date
	 */
	public Date getNextCheckDate(Date now)
	{
		setTime(now);

		switch (type)
		{
		case DailyRollingFileAndSizeAppender.TOP_OF_MINUTE:
			set(Calendar.SECOND, 0);
			set(Calendar.MILLISECOND, 0);
			add(Calendar.MINUTE, 1);
			break;
		case DailyRollingFileAndSizeAppender.TOP_OF_HOUR:
			set(Calendar.MINUTE, 0);
			set(Calendar.SECOND, 0);
			set(Calendar.MILLISECOND, 0);
			add(Calendar.HOUR_OF_DAY, 1);
			break;
		case DailyRollingFileAndSizeAppender.HALF_DAY:
			set(Calendar.MINUTE, 0);
			set(Calendar.SECOND, 0);
			set(Calendar.MILLISECOND, 0);
			int hour = get(Calendar.HOUR_OF_DAY);
			if (hour < 12)
			{
				set(Calendar.HOUR_OF_DAY, 12);
			} else
			{
				set(Calendar.HOUR_OF_DAY, 0);
				add(Calendar.DAY_OF_MONTH, 1);
			}
			break;
		case DailyRollingFileAndSizeAppender.TOP_OF_DAY:
			set(Calendar.HOUR_OF_DAY, 0);
			set(Calendar.MINUTE, 0);
			set(Calendar.SECOND, 0);
			set(Calendar.MILLISECOND, 0);
			add(Calendar.DATE, 1);
			break;
		case DailyRollingFileAndSizeAppender.TOP_OF_WEEK:
			set(Calendar.DAY_OF_WEEK, getFirstDayOfWeek());
			set(Calendar.HOUR_OF_DAY, 0);
			set(Calendar.MINUTE, 0);
			set(Calendar.SECOND, 0);
			set(Calendar.MILLISECOND, 0);
			add(Calendar.WEEK_OF_YEAR, 1);
			break;
		case DailyRollingFileAndSizeAppender.TOP_OF_MONTH:
			set(Calendar.DATE, 1);
			set(Calendar.HOUR_OF_DAY, 0);
			set(Calendar.MINUTE, 0);
			set(Calendar.SECOND, 0);
			set(Calendar.MILLISECOND, 0);
			add(Calendar.MONTH, 1);
			break;
		default:
			throw new IllegalStateException("Unknown periodicity type.");
		}
		return getTime();
	}
}