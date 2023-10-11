<?php

class Company
{
    private $id;
    private $name;
    private $email;
    private $telephone;
    private $description;
    private $country;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getTelephone()
    {
        return $this->telephone;
    }

    public function setTelephone($number)
    {
        $this->telephone = $number;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getCountry()
    {
        return $this->country;
    }

    public function setCountry($name)
    {
        $this->country = $name;
    }
}

?>