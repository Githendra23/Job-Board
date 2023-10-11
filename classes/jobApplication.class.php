<?php

class JobApplication
{
    private $id;
    private $candidateId;
    private $advertisementId;
    private $companyId;
    private $cv;
    private $coverLetter;

    public function getCoverLetter()
    {
        return $this->coverLetter;
    }

    public function setCoverLetter($file)
    {
        $this->coverLetter = $file;
    }

    public function getCv()
    {
        return $this->cv;
    }

    public function setCv($file)
    {
        $this->cv = $file;
    }

    public function getCompanyId()
    {
        return $this->companyId;
    }

    public function setCompanyId($companyId)
    {
        $this->companyId = $companyId;
    }

    public function getAdvertisement()
    {
        return $this->advertisementId;
    }

    public function setAdvertisementId($advertisementId)
    {
        $this->advertisementId = $advertisementId;
    }

    public function getCandidateId()
    {
        return $this->candidateId;
    }

    public function setCandidateId($candidateId)
    {
        $this->candidateId = $candidateId;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }
}

?>