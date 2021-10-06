document.addEventListener('DOMContentLoaded', () => {
    /*****************************************************************************
        * Variables and Data
    *****************************************************************************/
    const jobContainer = document.getElementById('job-container')
    const numJobs = document.getElementById('num-jobs')
    const inputCompanyName = document.getElementById('company-name')
    const inputJobTitle = document.getElementById('job-title')
    const submitBtn = document.getElementById('submit-btn')
    let JOBS

    /*****************************************************************************
        * Fetch localStorage Onload
    *****************************************************************************/
    if (!localStorage.getItem('jobs')) {
        console.log("No jobs yet")
        JOBS = []
    } else {
        JOBS = JSON.parse(localStorage.jobs)
        jobContainer.innerHTML = renderAllJobs(JOBS)
        numJobs.innerHTML = `${JOBS.length} JOBS`
        console.log(JOBS)
    }
    
    /*****************************************************************************
        * Event Listeners
    *****************************************************************************/
    submitBtn.addEventListener('click', (e) => {
        let randomRed = Math.floor(Math.random() * 255)
        let randomGreen = Math.floor(Math.random() * 255)
        let randomBlue = Math.floor(Math.random() * 255)
        let randomColor = `${randomRed}, ${randomGreen}, ${randomBlue}`
        let nextId = 1
        if (JOBS.length > 0) {
            nextId = JOBS[JOBS.length-1].id + 1
        }
        const jobObj = {
            id: nextId, 
            company: inputCompanyName.value, 
            title: inputJobTitle.value,
            color: randomColor,
            timestamp: Date.now()
        }
        JOBS.push(jobObj)
        localStorage.setItem('jobs', JSON.stringify(JOBS))
        jobContainer.innerHTML = renderAllJobs(JOBS)
    }) // End of submit button listener

    // Event listener on the job container to listen for the delete button the modal
    // and then find the job by id and delete it; update html
    jobContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'delete') {
            let foundJob = JOBS.filter(job => parseInt(job.id) === parseInt(e.target.dataset.id))
            console.log("Job", foundJob)
            let indexedJob = JOBS.indexOf(foundJob[0])
            console.log("Index of job", indexedJob)
            document.getElementById(`job-${e.target.dataset.id}`).remove()
            JOBS.splice(indexedJob, 1)
            localStorage.setItem('jobs', JSON.stringify(JOBS))
            location.reload()
            console.log(JOBS)
        }
        
    }) // End of event for delete

}) // End of DOMContentLoaded

/*******************************************************************************
    * Helper Functions
*******************************************************************************/
const renderAllJobs = (jobs) => {
    return jobs.map(job => jobHTML(job)).join('')
}

const jobHTML = (job) => {
    // Algorithm to set time when created
    let milliseconds = Date.now() - job.timestamp
    let timeAdded = Math.floor(milliseconds / 1000)
    let timerHTMl
    if (timeAdded < 60) {
        timerHTMl = `Added ${timeAdded}sec ago`
    } else if (timeAdded < 3600) {
        timeAdded = Math.floor(timeAdded / 60)
        timerHTMl = `Added ${timeAdded}min ago`
    } else if (timeAdded < 86400) {
        timeAdded = Math.floor(timeAdded / 3600)
        timerHTMl = `Added ${timeAdded}hours ago`
    }
    return `
        <div class="card border-4 rounded-3" id="job-${job.id}" style="width: 18rem; background-color: rgb(${job.color});">
            <div class="card-body">
                <!-- Button trigger modal -->
                <button type="button" id="delete-btn" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#deleteJob${job.id}">
                    <i class="fa fa-trash-o"></i>
                </button>
                <!-- Modal -->
                <div style="color: #673AB7;" class="modal fade" id="deleteJob${job.id}" tabindex="-1" aria-labelledby="deleteJobLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteJob${job.id}Label">Delete Job</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete this job?
                            </div>
                            <div class="modal-footer">
                                <button data-action="delete" data-id="${job.id}" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                <h5 class="card-title">${job.company}</h5>
                <h6 class="card-text">${job.title}</h6>
                <h7 style="float: right;">${timerHTMl}</h7>
            </div>
        </div>
    `
}