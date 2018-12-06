package com.ccjp.hospitalmanagement;

import java.util.Date;

public class hospitalVO {

	private String name;
	private String serialNo;
	private String mnrNo;
	private String gender;
	private Date admissionDate;
	private Date dischargeDate;
	public hospitalVO(String name, String serialNo, String mnrNo, String gender,
			Date admissionDate, Date dischargeDate) {
		this.name = name;
		this.serialNo = serialNo;
		this.mnrNo = mnrNo;
		this.gender = gender;
		this.admissionDate = admissionDate;
		this.dischargeDate = dischargeDate;
	}
	public hospitalVO() {
		// TODO Auto-generated constructor stub
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSerialNo() {
		return serialNo;
	}
	public void setSerialNo(String serialNo) {
		this.serialNo = serialNo;
	}
	public String getMnrNo() {
		return mnrNo;
	}
	public void setMnrNo(String mnrNo) {
		this.mnrNo = mnrNo;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public Date getAdmissionDate() {
		return admissionDate;
	}
	public void setAdmissionDate(Date admissionDate) {
		this.admissionDate = admissionDate;
	}
	public Date getDischargeDate() {
		return dischargeDate;
	}
	public void setDischargeDate(Date dischargeDate) {
		this.dischargeDate = dischargeDate;
	}
	@Override
	public String toString() {
		return "hospitalVO [name=" + name + ", serialNo=" + serialNo + ", mnrNo="
				+ mnrNo + ", gender=" + gender + ", admissionDate=" + admissionDate
				+ ", dischargeDate=" + dischargeDate + "]";
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((serialNo == null) ? 0 : serialNo.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		hospitalVO other = (hospitalVO) obj;
		if (serialNo == null) {
			if (other.serialNo != null)
				return false;
		} else if (!serialNo.equals(other.serialNo))
			return false;
		return true;
	}




}
