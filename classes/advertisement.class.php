<?php

class Advertisement
{
    private $id;
    private $title;
    private $description;
    private $address;
    private $employment_contract_type;
    private $country;
    private $wage;
    private $tag;
    private $companyId;

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setAddress($address)
    {
        $this->address = $address;
    }

    public function getAddress()
    {
        return $this->description;
    }

    public function setEmploymentContractType($employment_contract_type)
    {
        $this->employment_contract_type = $employment_contract_type;
    }

    public function getEmploymentContractType()
    {
        return $this->employment_contract_type;
    }

    public function setCountry($country)
    {
        $this->country = $country;
    }

    public function getCountry()
    {
        return $this->country;
    }

    public function setWage($wage)
    {
        $this->wage = $wage;
    }

    public function getWage()
    {
        return $this->wage;
    }

    public function setTag($tag)
    {
        $this->tag = $tag;
    }

    public function getTag()
    {
        return $this->tag;
    }

    public function setCompanyId($companyId)
    {
        $this->companyId = $companyId;
    }

    public function getCompanyId()
    {
        return $this->companyId;
    }
}

?>