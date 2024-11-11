-- View for task status counts per project
CREATE VIEW vw_project_task_status AS
SELECT 
    w.projectId,
    COUNT(t.id) as total_tasks,
    SUM(CASE t.status WHEN 'done' THEN 1 ELSE 0 END) as completed_tasks,
    SUM(CASE t.status WHEN 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
    SUM(CASE t.status WHEN 'review' THEN 1 ELSE 0 END) as review_tasks,
    SUM(CASE t.status WHEN 'todo' THEN 1 ELSE 0 END) as todo_tasks
FROM 
    Projects p
    LEFT JOIN WorkPackages w ON p.id = w.projectId
    LEFT JOIN Activites a ON w.id = a.workPackageId
    LEFT JOIN Taches t ON a.id = t.activiteId
GROUP BY 
    w.projectId;

-- Stored procedure to calculate and update project progress
DELIMITER //

CREATE PROCEDURE sp_update_project_progress(IN p_project_id INT)
BEGIN
    DECLARE v_progress DECIMAL(5,2);
    
    -- Calculate progress based on task status weights
    SELECT 
        COALESCE(
            ROUND(
                (
                    (completed_tasks * 100) + 
                    (in_progress_tasks * 50) + 
                    (review_tasks * 75)
                ) / NULLIF(total_tasks, 0)
            , 0)
        , 0)
    INTO v_progress
    FROM 
        vw_project_task_status
    WHERE 
        projectId = p_project_id;

    -- Update project progress
    UPDATE Projects 
    SET 
        progress = v_progress,
        status = CASE 
            WHEN v_progress = 100 THEN 'completed'
            WHEN v_progress > 0 THEN 'in_progress'
            ELSE 'not_started'
        END
    WHERE 
        id = p_project_id;
END //

-- Trigger to update project progress when task status changes
CREATE TRIGGER trg_task_status_update
AFTER UPDATE ON Taches
FOR EACH ROW
BEGIN
    DECLARE v_project_id INT;
    
    -- Get project ID for the updated task
    SELECT 
        w.projectId 
    INTO v_project_id
    FROM 
        Activites a
        JOIN WorkPackages w ON a.workPackageId = w.id
    WHERE 
        a.id = NEW.activiteId;
    
    -- Update project progress
    IF v_project_id IS NOT NULL THEN
        CALL sp_update_project_progress(v_project_id);
    END IF;
END //

DELIMITER ;
