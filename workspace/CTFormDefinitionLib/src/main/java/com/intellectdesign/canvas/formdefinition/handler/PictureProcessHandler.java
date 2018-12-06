/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.handler;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FilenameUtils;

import com.intellectdesign.canvas.audit.handler.AuditConstants;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.deviceband.DeviceCategory;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventDispatcher;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.formdefinition.FormDefinitionInstruction;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;

import eu.medsea.mimeutil.MimeException;
import eu.medsea.mimeutil.MimeUtil;

/**
 * 
 * This handler is responsible for handling the Picture upload from client
 * 
 */
public class PictureProcessHandler extends SimpleRequestHandler
{

	private static final Logger LOGGER = Logger.getLogger(PictureProcessHandler.class);
	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	private static String HASH_MAP_POSITION = "26";

	/**
	 * This method for processing the user request for picture upload.
	 * 
	 * @param input - Class object containing the request for processing.
	 * @return replyObject - Class object containing the picture upload data
	 * 
	 * @throws OnlineException
	 * 
	 * @see com.intellectdesign.canvas.handler.SimpleRequestHandler#processRequest(java.lang.Object)
	 */
	@Override
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		Map paramsMap = getAugmentedCachedHashMap(inputVector);
		paramsMap.put("REQ_HEADER_DATA", inputVector.get(TIConstants.VALUE_VECTOR_21));
		paramsMap.put("SESSION_ID", inputVector.get(0));
		ExtReplyObject replyObject = null;
		String action = null;
		String strGCIF = (String) inputVector.get(2);
		String srtUserNo = (String) inputVector.get(3);
		LOGGER.ctdebug("CTFDF00001", strGCIF, srtUserNo);
		replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap();
		try
		{
			action = (String) paramsMap.get(JSPIOConstants.INPUT_ACTION);
			LOGGER.ctdebug("CTFDF00023", action);

			if (FormDefinitionConstants.PICTURE_PROCESS_ACTION.equals(action))
			{
				String imageProcessAction = (String) paramsMap.get(FormDefinitionConstants.IMAGE_PROCESS_ACTION);
				if ("GET_USER_IMAGE".equals(imageProcessAction))
				{
					replyObject = retrieveUserImage(inputVector, srtUserNo);
				} else if ("STORE_USER_IMAGE".equals(imageProcessAction))
				{
					replyObject = persistUserImage(inputVector, srtUserNo, paramsMap);
				} else
				{
					LOGGER.cterror("CTFDF00128", imageProcessAction);
				}
			} else
			{
				LOGGER.cterror("CTFDF00127", action);
			}

		} catch (Exception e)
		{
			throw new ProcessingErrorException(e);
		}
		LOGGER.ctdebug("CTFDF00010", replyObject);
		return replyObject;

	}

	/**
	 * This method handles the action to persist the user image.
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields
	 * @param userNumber - String value of the UserNo
	 * @param paramsMap - Map object containing the cached client data
	 * @return reply - ExtReplyObject with image persisting status as success/failure
	 * @throws ProcessingErrorException
	 */
	private ExtReplyObject persistUserImage(Vector inputVector, String userNumber, Map paramsMap)
	{
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		String fileExt = "";
		String fileExtn = "";
		Boolean isValidExtn = true;
		byte[] imageStream = (byte[]) paramsMap.get("FILE_STREAM");
		String userProvidedFileName = (String) paramsMap.get("FILE_NAME");
		int fileIndex = userProvidedFileName.lastIndexOf(".");
		if (fileIndex != -1)
		{
			fileExt = userProvidedFileName.substring(fileIndex);
			fileExtn = userProvidedFileName.substring(fileIndex + 1, userProvidedFileName.length());
		}
		// Verifying whether the extension is valid or not
		isValidExtn = isValidFileExtension(fileExtn);
		if (!isValidExtn)
		{
			// Validation failed. The file name does not have an extension or the extn is not a supported extension.
			// Construct an error reply object
			reply.headerMap.put("RESULT", "FAILURE");
			reply.headerMap.put("VALID_EXTENSION", isValidExtn);
			return reply;
		}
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		// Step 1: Save the file into the user images folder.
		String userImagesPath = configMgr.getCompPrefDescriptor().getUserImageUploadPath();
		File dir = new File(userImagesPath);
		// Fail safe. First ensure that directory is present
		if (!dir.isDirectory())
		{
			// Create the directory if it is not present.
			dir.mkdirs();
		}

		String evaluatedFileName = userNumber + fileExt;
		LOGGER.ctdebug("CTFDF00025", userNumber, evaluatedFileName);
		File srcFile = new File(dir, evaluatedFileName);
		boolean persistSuccess = persistFile(srcFile, imageStream, userNumber, paramsMap);
		if (!persistSuccess)
		{
			// Construct an error reply object
			reply.headerMap.put("RESULT", "FAILURE");
		} else
		{
			raiseEventForProfilePicUpdate((HashMap) paramsMap);
			reply.headerMap.put("RESULT", "SUCCESS");
			// Step 2: Compress the image.
			compressImage(srcFile, userImagesPath, userNumber);
			// Construct a success reply object
		}

		return reply;
	}

	/**
	 * This is a helper method to persist the file
	 * 
	 * @param destFile - File object containing the image file to persist
	 * @param fileData - Array of bytes of file data
	 * @param userNumber - String value of the User No
	 * @return true if successfully saved otherwise false
	 */
	private boolean persistFile(File destFile, byte[] fileData, String userNumber, Map paramsMap)
	{
		boolean success = false;
		List acceptedFileFormats = null;
		List<String> userSupportedFormats = null;
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			String userImagesPath = configMgr.getCompPrefDescriptor().getUserImageUploadPath();
			userSupportedFormats = getUserImageFormats();
			FormDefinitionInstruction formInstr = new FormDefinitionInstruction();
			acceptedFileFormats = formInstr.getUserImageMimeTypes(userSupportedFormats);
			Collection mimeTypes = getMimeTypes(destFile);
			boolean isAllowedMimetype = false;
			if (!mimeTypes.isEmpty())
			{
				Iterator mimeTypesItr = mimeTypes.iterator();
				while (mimeTypesItr.hasNext())
				{
					isAllowedMimetype = acceptedFileFormats.contains(mimeTypesItr.next());
					if (isAllowedMimetype)
					{
						break;
					}
				}
			}
			if (isAllowedMimetype)
			{
				int fileIndex;
				File dir = new File(userImagesPath);
				File[] fileList = dir.listFiles();
				for (int x = 0; x < fileList.length; x++)
				{ // used for delete existing image with the same usernumber
					if ((fileIndex = fileList[x].getName().lastIndexOf(".")) != -1)
					{
						if (fileList[x].getName().substring(0, fileIndex).equals(userNumber))
						{
							fileList[x].delete();
						}
					}
				}
				// Mobility File Upload Enable Starts
				BufferedImage bimage = ImageIO.read(new ByteArrayInputStream(fileData));
				Object imgOrientationParam = paramsMap.get("IMG_ORIENTATION");
				if (imgOrientationParam != null)
				{
					/**
					 * img_orientation which represents the orientation information .Based on these values image has
					 * been rotated.
					 */
					String imgOrientation = (String) paramsMap.get("IMG_ORIENTATION");
					ExifOrientationCode exifCode = null;
					try
					{
						exifCode = ExifOrientationCode.getValueOf(imgOrientation);
					} catch (IllegalArgumentException ex)
					{
						LOGGER.cterror("CTFDF00129", ex);
					}
					if (exifCode != null)
						exifCode.rotateImage(bimage);
				}
				File outputfile = new File(destFile.getPath());
				ImageIO.write(bimage, FilenameUtils.getExtension(destFile.getPath()), outputfile);
				success = true;
			} else
			{
				success = false;
				LOGGER.cterror("CTFDF00026");
			}
		} catch (FileNotFoundException e)
		{
			success = false;
			LOGGER.cterror("CTFDF00027", e, destFile.getName());
		} catch (IOException e)
		{
			success = false;
			LOGGER.cterror("CTFDF00028", e, destFile.getName());
		} catch (Exception e)
		{
			success = false;
			LOGGER.cterror("CTFDF00028", e, destFile.getName());
		}
		return success;
	}

	/**
	 * This helper method compresses the image file provided. In case there are any exceptions, this method will return
	 * false
	 * 
	 * @param srcFile - File object containing the file to be compressed
	 * @param imageDir - String value of the image directory
	 * @param userNumber - String value of the UserNo
	 * 
	 * @return outputFile - File object containing compressed image file
	 */
	private File compressImage(File srcFile, String imageDir, String userNumber)
	{
		String fileName = srcFile.getName();
		String newFileName = imageDir + File.separator + userNumber;
		LOGGER.ctdebug("CTFDF00029", fileName, srcFile.length());
		String suffix = "";
		int extnIndex = fileName.lastIndexOf(".");
		if (extnIndex != -1)
			suffix = fileName.substring(extnIndex + 1);
		newFileName += "." + suffix;
		File outputFile = new File(newFileName);
		try
		{
			BufferedImage img = ImageIO.read(srcFile);
			Iterator<ImageWriter> writers = ImageIO.getImageWritersBySuffix(suffix);
			if (writers.hasNext())
			{
				ImageWriter writer = writers.next();
				ImageWriteParam param = writer.getDefaultWriteParam();
				param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
				param.setCompressionQuality(0.3f);
				// Set the new file name as the file to which content should be written to.
				FileOutputStream bos = new FileOutputStream(outputFile);
				ImageOutputStream ios = ImageIO.createImageOutputStream(bos);
				writer.setOutput(ios);
				writer.write(null, new IIOImage(img, null, null), param);
				ios.flush();
				ios.close();
				bos.close();
				LOGGER.ctdebug("CTFDF00030", newFileName, outputFile.length());
			} else
			{
				LOGGER.ctdebug("CTFDF00031", suffix);
				srcFile.renameTo(outputFile);
			}
		} catch (IOException e)
		{
			LOGGER.cterror("CTFDF00032", e);
			srcFile.renameTo(outputFile);
		} catch (Throwable uoe)
		{
			LOGGER.cterror("CTFDF00033", uoe);
			srcFile.renameTo(outputFile);
		}
		return outputFile;
	}

	/**
	 * This method retrieves the user image and sends back in the reply object
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields
	 * @param userNumber - String value of the UserNo
	 * @return replyobject - ExtReplyObject containing the image
	 * 
	 */
	private ExtReplyObject retrieveUserImage(Vector inputVector, String userNumber)
	{
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		File userImageFile = getUserImageFile(userNumber);
		Map paramsMap = getAugmentedCachedHashMap(inputVector);
		String deviceType = (String) paramsMap.get("deviceType");
		String contentType = getContentType(userImageFile);
		if (DeviceCategory.MOBILE.getCode().equals(deviceType) || DeviceCategory.TABLET.getCode().equals(deviceType))
		{
			retrieveImageAsData(reply, userImageFile, paramsMap, contentType);

		} else
		{
			retrieveImageAsStream(reply, userImageFile, contentType);
		}
		return reply;
	}

	/**
	 * Method retrieves the user image as byte stream.
	 * 
	 * @param reply
	 * @param userImageFile
	 * @param contentType
	 */
	private void retrieveImageAsStream(ExtReplyObject reply, File userImageFile, String contentType)
	{
		boolean success = false;
		HashMap obj = readUserImageAsByteArray(userImageFile);
		byte[] imageData = (byte[]) obj.get("outputStream");
		success = (Boolean) obj.get("success");
		if (success)
		{
			// Build a success reply
			reply.headerMap.put("IMAGE_DATA", imageData);
			reply.headerMap.put("FILE_NAME", userImageFile.getName());
			reply.headerMap.put("RESULT", "SUCCESS");
			reply.headerMap.put("contentType", contentType);
		} else
		{
			reply.headerMap.put("RESULT", "FAILURE");
		}
	}

	/**
	 * Method retrieves the image as the string
	 * 
	 * @param reply
	 * @param userImageFile
	 * @param paramsMap
	 * @param contentType
	 */
	private void retrieveImageAsData(ExtReplyObject reply, File userImageFile, Map paramsMap, String contentType)
	{
		boolean success = false;
		// Initially Added STATUS as 'NEW'
		String status = "NEW";
		String oldModifiedDate = (String) paramsMap.get("lastModified");
		Long lastModified = userImageFile.lastModified();
		String newModifiedDate = lastModified.toString();
		StringBuilder imageData = new StringBuilder();
		if (!(newModifiedDate).equals(oldModifiedDate))
		{
			String imageDataString = null;
			HashMap obj = readUserImageAsByteArray(userImageFile);
			success = (Boolean) obj.get("success");
			imageData.append("data:" + contentType + ";base64,");
			if (success)
			{
				imageDataString = encodeImage((byte[]) obj.get("outputStream"));
				if (!imageDataString.isEmpty())
					imageData.append(imageDataString);
				else
					success = false;
			}
		} else
		{
			status = "OLD";
			success = true;
		}
		if (success)
		{
			// Build a success reply
			reply.headerMap.put("IMAGE_DATA", imageData.toString());
			reply.headerMap.put("FILE_NAME", userImageFile.getName());
			// Added lastModifiedDate,server synctime,contentType and Status to the reply.
			reply.headerMap.put("LAST_MODIFIED", newModifiedDate);
			reply.headerMap.put("contentType", contentType);
			reply.headerMap.put("STATUS", status);
			reply.headerMap.put("SERVER_SYNCTIME", getServerDateAndTime());
			reply.headerMap.put("RESULT", "SUCCESS");
		} else
		{
			reply.headerMap.put("RESULT", "FAILURE");
		}
	}

	/**
	 * This method retrieves the user image and returns as byte Array along with the success flag.
	 * 
	 * @param userImageFile - full path of the destination image file
	 * 
	 */
	private HashMap readUserImageAsByteArray(File userImageFile)
	{
		FileInputStream fis = null;
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(1024);
		HashMap returnMap = new HashMap();
		boolean success = false;
		try
		{
			fis = new FileInputStream(userImageFile);
			int length;
			byte[] buffer = new byte[1024];
			while ((length = fis.read(buffer)) != -1)
			{
				outputStream.write(buffer, 0, length);
			}
			success = true;
		} catch (FileNotFoundException e)
		{
			LOGGER.cterror("CTFDF00034", e, userImageFile.getName());
			success = false;
		} catch (IOException e)
		{
			LOGGER.cterror("CTFDF00035", e, userImageFile.getName());
			success = false;
		} finally
		{
			try
			{
				if (fis != null)
					fis.close();
			} catch (IOException e)
			{
				// Ignore this execution
			}
		}

		returnMap.put("outputStream", outputStream.toByteArray());
		returnMap.put("success", success);
		return returnMap;
	}

	/**
	 * This helper method returns contentType for the destination file.
	 * 
	 * @param userImageFile - File object contains the full filepath of user image.
	 * 
	 * @return contentType - String object containing the content type for that file.
	 */
	private String getContentType(File userImageFile)
	{
		String contentType = null;
		try
		{
			Collection mimeList = getMimeTypes(userImageFile);
			if (!mimeList.isEmpty())
			{
				contentType = String.valueOf(mimeList.toArray()[0]);
			}
			// if above case fail,then assigning the default contentType.
			else
			{
				String fileExtension = MimeUtil.getExtension(userImageFile);
				contentType = "image/" + fileExtension.toLowerCase();
			}

		} catch (Exception e)
		{
			LOGGER.cterror("CTFDF00126", e);
		}
		return contentType;
	}

	/**
	 * This helper method returns mime types for the particular destination file.
	 * 
	 * @param userImageFile - File object contains the full filepath of user image.
	 * 
	 * @return mimeTypes - Collection object contains corresponding mimeTypes for the destination file.
	 */
	private Collection getMimeTypes(File userImageFile)
	{
		Collection mimeTypes = new ArrayList();
		try
		{
			MimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector");
			MimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.ExtensionMimeDetector");
			MimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.OpendesktopMimeDetector");
			mimeTypes = MimeUtil.getMimeTypes(userImageFile);
		} catch (MimeException e)
		{
			LOGGER.cterror("CTFDF00125", e, userImageFile.getAbsolutePath());
		}
		return mimeTypes;
	}

	/**
	 * This helper method retrieves the current user image file. In case the file does not exist, then returns the
	 * default image
	 * 
	 * @param userNumber - String value of the userNo
	 * @return userImageFile - File object containing user image file
	 */
	private File getUserImageFile(String userNumber)
	{
		File userImageFile = null;
		String userImageFileName = "Default.png";
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String userImagesPath = configMgr.getCompPrefDescriptor().getUserImageUploadPath();
		File dir = new File(userImagesPath);
		try
		{
			String aName;
			if (!dir.isDirectory())
			{
				dir.mkdirs();
				LOGGER.ctdebug("CTFDF00036");
			}
			File[] allFiles = dir.listFiles();
			// Loop through all the files to see if there is a file name that contains the user number. extension could
			// be anything
			for (int i = 0; i < allFiles.length; i++)
			{
				aName = allFiles[i].getName();
				if (aName.startsWith(userNumber))
				{
					// Got the match.
					userImageFileName = aName;
					break;
				}
			}
		} catch (Exception ex)
		{
			LOGGER.cterror("CTFDF00037", ex);
			userImageFileName = "Default.png";
		}
		userImageFile = new File(dir, userImageFileName);
		return userImageFile;
	}

	/**
	 * This method gets the cached HashMap from InputVector. Same as getJSPHashMap method except that other transaction
	 * related data is also populated in the return HashMap.
	 * 
	 * @param inputVector - Vector Contains TI framework defined fields
	 * 
	 * @return Map - Cached HashMap with additional data from Vector
	 */
	private static Map getAugmentedCachedHashMap(Vector inputVector)
	{
		HashMap map = getFieldsHashMapFromVector(inputVector);
		map.put(JSPIOConstants.INPUT_REFERENCE_NO, inputVector.get(TIConstants.REFERENCE_NO_POS));
		map.put(TRConstants.VER_NO, inputVector.get(VER_NO_POS));
		map.put(TIConstants.TXN_STATUS, inputVector.get(TXN_STATUS_POS));
		// map.put(TIConstants.CHANNEL_ID, ((HashMap)
		// inputVector.get(TIConstants.VALUE_VECTOR_21)).get(TIConstants.CHANNEL_ID));
		map.put(TIConstants.CHANNEL_ID, inputVector.get(10));
		return map;
	}

	/**
	 * This refactored method gets the jspfields hashmap from vector either from the 26th index in the vector, if not
	 * get from the last but one the position from the vector
	 * 
	 * @param inputVector - Vector object containing TI framework defined fields
	 * @return map - hashpmap present in the vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(Integer.parseInt(HASH_MAP_POSITION) + 1);
		if (cachedHashMapObj instanceof HashMap)
			map = (HashMap) cachedHashMapObj;
		else
		{
			cachedHashMapObj = inputVector.get(inputVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
			if (cachedHashMapObj instanceof HashMap)
				map = (HashMap) cachedHashMapObj;
		}
		return map;
	}

	/**
	 * Helper method to raise event
	 * 
	 * @param inputMap Event Data Map
	 */
	private void raiseEventForProfilePicUpdate(HashMap inputMap)
	{
		Event prefUpdateEvent = Event.getEventFor("CANVAS", "PERSONALIZ", "USER_PREF", "PROFILE_PIC_UPDATE");
		HashMap eventData = new HashMap();
		HashMap prefMap = new HashMap();
		HashMap ReqHeaderMap = (HashMap) inputMap.get("REQ_HEADER_DATA");

		prefMap.put(EventHandlerFrameworkConstants.FLD_USER_NO, inputMap.get(JSPIOConstants.INPUT_USER_NO));
		prefMap.put(EventHandlerFrameworkConstants.FLD_GCIF, inputMap.get(JSPIOConstants.INPUT_GCIF));
		prefMap.put(EventHandlerFrameworkConstants.FLD_SESSION_ID,
				inputMap.get(EventHandlerFrameworkConstants.FLD_SESSION_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_LOGIN_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_KEY, inputMap.get(JSPIOConstants.INPUT_USER_NO));
		prefMap.put(EventHandlerFrameworkConstants.FLD_CHANNEL_ID,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_CHANNEL_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_BROWSER,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_BROWSER_NAME));
		prefMap.put(EventHandlerFrameworkConstants.FLD_CLIENT_IP,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_CLIENT_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_LOGIN_ID,
				ReqHeaderMap.get(EventHandlerFrameworkConstants.FLD_LOGIN_ID));
		prefMap.put("FILE_NAME", inputMap.get("FILE_NAME"));

		eventData.putAll(prefMap);

		eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, prefMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, prefMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, prefMap);
		try
		{
			EventDispatcher.getInstance().raiseEvent(prefUpdateEvent, eventData);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTFDF00125", ex);
		}
	}

	/**
	 * Encodes the byte array into base64 string
	 * 
	 * @param imageByteArray - byte array
	 * @return String a {@link java.lang.String}
	 */
	public static String encodeImage(byte[] imageByteArray)
	{
		return Base64.encodeBase64String(imageByteArray);
	}

	/**
	 * Helper method that get server Date and Time
	 * 
	 * @return serverDateTime
	 */
	private static String getServerDateAndTime()
	{
		DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		Date date = new Date();
		String serverDateTime = dateFormat.format(date);
		return serverDateTime;
	}

	/**
	 * Helper method that returns the user supported image formats.
	 * 
	 * @return userImageFileFormats
	 */
	private static List getUserImageFormats()
	{
		List<String> userSupportedFormats = new ArrayList<String>();
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String userImageFileFormats = configMgr.getCompPrefDescriptor().getUserImageSupportedFormats();
		String[] userImageExtensions = userImageFileFormats.split(",");
		userSupportedFormats = Arrays.asList(userImageExtensions);
		return userSupportedFormats;
	}

	/**
	 * Check for valid file extension.If the extension is valid return true else returns false.
	 * 
	 * @param extn
	 * @return boolean
	 */
	private boolean isValidFileExtension(String extn)
	{
		boolean isValid = false;
		List<String> extnList = null;
		if (extn != null && !"".equals(extn))
		{
			extnList = getUserImageFormats();
			isValid = extnList.contains(extn.toLowerCase());
		}
		return isValid;
	}

	/**
	 * Represents the EXIF image orientation formats for mobile devices.
	 */
	private enum ExifOrientationCode
	{
		DONOTHING("1", 0), FLIP_HORIZONTAL("2", 0), ROTATE_180("3", 180), FLIP_VERTICAL("4", 0), TRANSPOSE("5", 270), ROTATE_90(
				"6", 90), TRANSVERSE("7", 90), ROTATE_270("8", 270);
		private String orientationCode;
		private int degrees;

		/**
		 * The constructor of the orientationNumbers
		 * 
		 * @param orientationCode The code value.
		 */
		private ExifOrientationCode(String code, int angle)
		{
			orientationCode = code;
			degrees = angle;
		}

		/**
		 * @return the degrees
		 */
		public int getDegrees()
		{
			return degrees;
		}

		/**
		 * @return the orientationCode
		 */
		private String getOrientationCode()
		{
			return orientationCode;
		}

		/**
		 * Returns the particular exif code based on the orientation code.
		 * 
		 * @param exifCode orientation code of the image
		 * @return enumtype of the ExifOrientationCode
		 */
		protected static ExifOrientationCode getValueOf(String exifCode)
		{
			if (exifCode != null)
			{
				for (ExifOrientationCode eoc : ExifOrientationCode.values())
				{
					if (exifCode.equals(eoc.getOrientationCode()))
					{
						return eoc;
					}
				}
			}
			return null;
		}

		/**
		 * Rotates an image in the particular angle.
		 * 
		 * @param img The image to be rotated
		 * @param angle The angle in degrees
		 * @return The rotated image
		 */
		protected BufferedImage rotateImage(BufferedImage img)
		{
			double angle = getDegrees();
			int w = img.getWidth();
			int h = img.getHeight();
			BufferedImage dimg = new BufferedImage(w, h, img.getType());
			Graphics2D g = dimg.createGraphics();
			g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, // Anti-alias!
					RenderingHints.VALUE_ANTIALIAS_ON);

			g.rotate(Math.toRadians(angle), w / 2, h / 2);

			g.drawImage(img, null, 0, 0);
			return dimg;
		}
	}
}
