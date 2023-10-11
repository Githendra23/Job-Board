<?php

class candidateId
{
    private $id;
    private $name;
    private $surname;
    private $age;
    private $city;
    private $country;
    private $email;
    private $telephone;

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

    public function getSurname()
    {
        return $this->surname;
    }

    public function setSurname($surname)
    {
        $this->surname = $surname;
    }

    public function getAge()
    {
        return $this->age;
    }

    public function setAge($age)
    {
        $this->age = $age;
    }

    public function getCity()
    {
        return $this->city;
    }

    public function setCity($name)
    {
        $this->city = $name;
    }

    public function getCountry()
    {
        return $this->country;
    }

    public function setCountry($name)
    {
        $this->country = $name;
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
}

?>